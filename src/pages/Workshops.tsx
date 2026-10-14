import { useState, useCallback, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CalendarDays, CalendarPlus, FolderDown, X, ChevronLeft, ChevronRight } from "lucide-react";

const NETWORKAI_LOGO = "/lovable-uploads/e21b4c4b-1e82-4c5a-876a-6968681e2aeb.png";

/** Workshop row logo (≈4.22rem / 4.69rem). */
const LOGO_SQUARE = "h-[4.21875rem] w-[4.21875rem] sm:h-[4.6875rem] sm:w-[4.6875rem]";
const logoClass = `${LOGO_SQUARE} object-contain opacity-95 hover:opacity-100 transition-opacity`;

function googleCalendarTemplateUrl(params: { text: string; details: string; dates: string; location?: string }) {
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: params.text,
    dates: params.dates,
    details: params.details,
  });
  if (params.location) q.set("location", params.location);
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}

/** Shared fields for Google URL, .ics export, and date pill. */
type WorkshopSchedule = {
  text: string;
  details: string;
  dates: string;
  location?: string;
  weekday: string;
  dayMonth: string;
  time: string;
  place?: string;
  ariaLabel: string;
};

type WorkshopCalendar = {
  /** Omitted when the event has no confirmed time yet (no calendar link). */
  href?: string;
  weekday: string;
  dayMonth: string;
  time: string;
  place?: string;
  ariaLabel: string;
};

function calendarFromSchedule(s: WorkshopSchedule): WorkshopCalendar {
  return {
    href: googleCalendarTemplateUrl({
      text: s.text,
      details: s.details,
      dates: s.dates,
      location: s.location,
    }),
    weekday: s.weekday,
    dayMonth: s.dayMonth,
    time: s.time,
    place: s.place,
    ariaLabel: s.ariaLabel,
  };
}

function escapeIcsText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
}

/** RFC 5545 folding: max 75 octets per segment (ASCII-safe for our copy). */
function foldIcsLine(line: string): string {
  const limit = 75;
  if (line.length <= limit) return line;
  const parts: string[] = [];
  parts.push(line.slice(0, limit));
  let rest = line.slice(limit);
  while (rest.length > 0) {
    const chunk = rest.slice(0, limit - 1);
    parts.push(` ${chunk}`);
    rest = rest.slice(limit - 1);
  }
  return parts.join("\r\n");
}

function formatIcsUtcStamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function veventFromSchedule(id: string, s: WorkshopSchedule, dtstamp: string): string {
  const [dtStart, dtEnd] = s.dates.split("/");
  const uid = `networkai-workshop-${id}-2026@networkai.uw`;
  const lines = [
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    foldIcsLine(`SUMMARY:${escapeIcsText(s.text)}`),
    foldIcsLine(`DESCRIPTION:${escapeIcsText(s.details)}`),
    ...(s.location ? [foldIcsLine(`LOCATION:${escapeIcsText(s.location)}`)] : []),
    "END:VEVENT",
  ];
  return lines.join("\r\n");
}

function buildWorkshopsIcs(entries: { id: string; schedule: WorkshopSchedule }[]): string {
  const dtstamp = formatIcsUtcStamp(new Date());
  const body = entries.map((e) => veventFromSchedule(e.id, e.schedule, dtstamp)).join("\r\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//UW NetworkAI//Workshop Schedule//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    body,
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

function downloadAllWorkshopsIcs(entries: { id: string; schedule: WorkshopSchedule }[]) {
  const ics = buildWorkshopsIcs(entries);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "networkai-workshops-fall-2026.ics";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const datePillClass =
  "mt-0.5 flex min-w-[4.85rem] max-w-[5.5rem] flex-col items-center rounded-xl bg-primary/15 px-2.5 py-2 text-center sm:min-w-[5rem] sm:max-w-[5.75rem]";

type WorkshopResource = {
  href: string;
  filename: string;
  label: string;
  sizeLabel?: string;
};

type WorkshopEntry = {
  id: string;
  title: string;
  /** Present when date + time are confirmed; drives the calendar link and .ics export. */
  schedule?: WorkshopSchedule;
  /** Shown in the date pill when there is no confirmed schedule. */
  pill?: Omit<WorkshopCalendar, "href" | "ariaLabel">;
};

const workshopEntries: WorkshopEntry[] = [
  {
    id: "agentic-ai",
    title: "Agentic AI",
    schedule: {
      text: "NetworkAI — Agentic AI",
      details: "Hosted by UW NetworkAI.\n\n5:30–6:30 PM · PCAR 295 (Paccar Hall).",
      dates: "20261027T003000Z/20261027T013000Z",
      location: "PCAR 295",
      weekday: "Mon",
      dayMonth: "Oct 26",
      time: "5:30–6:30 PM",
      place: "PCAR 295",
      ariaLabel: "Add Agentic AI to Google Calendar — Monday, October 26, 2026, 5:30 to 6:30 PM, PCAR 295",
    },
  },
  {
    id: "case-competition",
    title: "Case Competition",
    pill: {
      weekday: "Thu–Fri",
      dayMonth: "Nov 5–6",
      time: "Time TBD",
      place: "Room TBD",
    },
  },
  {
    id: "recruiter-event",
    title: "Recruiter Event",
    schedule: {
      text: "NetworkAI — Recruiter Event",
      details: "Hosted by UW NetworkAI.\n\n6:30–8:00 PM.",
      dates: "20261117T023000Z/20261117T040000Z",
      weekday: "Mon",
      dayMonth: "Nov 16",
      time: "6:30–8 PM",
      ariaLabel: "Add Recruiter Event to Google Calendar — Monday, November 16, 2026, 6:30 to 8:00 PM",
    },
  },
  {
    id: "enterprise-ai",
    title: "Enterprise AI Workshop",
    schedule: {
      text: "NetworkAI — Enterprise AI Workshop",
      details: "Hosted by UW NetworkAI.\n\n5:30–6:30 PM · PCAR 295 (Paccar Hall).",
      dates: "20261124T013000Z/20261124T023000Z",
      location: "PCAR 295",
      weekday: "Mon",
      dayMonth: "Nov 23",
      time: "5:30–6:30 PM",
      place: "PCAR 295",
      ariaLabel: "Add Enterprise AI Workshop to Google Calendar — Monday, November 23, 2026, 5:30 to 6:30 PM, PCAR 295",
    },
  },
];

const ICS_ENTRIES = workshopEntries.flatMap((e) => (e.schedule ? [{ id: e.id, schedule: e.schedule }] : []));

const workshops = workshopEntries.map(({ id, title, schedule, pill }) => ({
  id,
  title,
  calendar: schedule
    ? calendarFromSchedule(schedule)
    : pill
      ? { ...pill, ariaLabel: `${title}, ${pill.dayMonth}` }
      : undefined,
}));

type PastEvent = {
  title: string;
  date: string;
  slides?: WorkshopResource;
};

const pastEvents: PastEvent[] = [
  {
    title: "AI ethics with Business Ethics Association",
    date: "May 18, 2026",
  },
  {
    title: "NetworkAI × KTP recruiter event",
    date: "May 5, 2026",
  },
  {
    title: "MCP workshop",
    date: "Apr 27, 2026",
    slides: {
      href: "/workshops/resources/networkai-mcp-workshop-slides.pptx",
      filename: "NetworkAI-MCP-Workshop-Slides.pptx",
      label: "Slides (PPTX)",
      sizeLabel: "2.3 MB",
    },
  },
  {
    title: "Vibecoding workshop",
    date: "Apr 13, 2026",
    slides: {
      href: "/workshops/resources/networkai-info-night-slides.pptx",
      filename: "NetworkAI-Info-Night-Slides.pptx",
      label: "Slides (PPTX)",
      sizeLabel: "26 MB",
    },
  },
];

function WorkshopDateColumn({ calendar }: { calendar?: WorkshopCalendar }) {
  if (!calendar) {
    return (
      <div className={datePillClass}>
        <CalendarDays className="mb-0.5 h-5 w-5 text-indigo-300" aria-hidden />
        <span className="text-[10px] font-semibold uppercase leading-none tracking-wide text-muted-foreground">TBD</span>
      </div>
    );
  }

  const pillContent = (
    <>
      <CalendarDays className="mb-0.5 h-5 w-5 text-indigo-300" aria-hidden />
      <span className="text-[10px] font-semibold uppercase leading-none tracking-wide text-muted-foreground">
        {calendar.weekday}
      </span>
      <span className="mt-0.5 font-display text-sm font-bold leading-tight text-foreground">{calendar.dayMonth}</span>
      <span className="mt-1 text-[10px] font-medium leading-tight text-muted-foreground">{calendar.time}</span>
      {calendar.place ? (
        <span className="mt-0.5 text-[9px] leading-snug text-muted-foreground/90">{calendar.place}</span>
      ) : (
        <span className="mt-0.5 min-h-[0.75rem] text-[9px] leading-snug text-muted-foreground/40" aria-hidden>
          {"\u00a0"}
        </span>
      )}
    </>
  );

  if (!calendar.href) {
    return (
      <div className="flex shrink-0 flex-col items-center gap-1.5 rounded-lg text-center">
        <span className={datePillClass}>{pillContent}</span>
      </div>
    );
  }

  return (
    <a
      href={calendar.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex shrink-0 flex-col items-center gap-1.5 rounded-lg text-center ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
      aria-label={calendar.ariaLabel}>
      <span
        className={`${datePillClass} transition-colors group-hover:bg-primary/25 group-focus-visible:bg-primary/25`}>
        {pillContent}
      </span>
      <span className="max-w-[6.5rem] text-balance text-[9px] leading-tight text-muted-foreground sm:max-w-[7rem] sm:text-[10px]">
        Click to add to Google Calendar
      </span>
    </a>
  );
}

function WorkshopLogo() {
  return (
    <div className="flex w-full shrink-0 items-center justify-end sm:ml-auto sm:w-auto sm:pt-0.5">
      <img src={NETWORKAI_LOGO} alt="NetworkAI" className={logoClass} />
    </div>
  );
}

const galleryPhotos = [
  { src: "/workshops/gallery/dsc08500.jpg", alt: "KTP × NetworkAI recruiter event" },
  { src: "/workshops/gallery/dsc08503.jpg", alt: "KTP × NetworkAI recruiter event" },
  { src: "/workshops/gallery/dsc08510.jpg", alt: "KTP × NetworkAI recruiter event" },
  { src: "/workshops/gallery/dsc08514.jpg", alt: "KTP × NetworkAI recruiter event" },
  { src: "/workshops/gallery/dsc08554.jpg", alt: "KTP × NetworkAI recruiter event" },
  { src: "/workshops/gallery/thumbs-up.jpg", alt: "Members giving a thumbs up at a NetworkAI session" },
  { src: "/workshops/gallery/class-smiles.jpg", alt: "Students smiling during a NetworkAI session" },
  { src: "/workshops/gallery/group-photo.jpg", alt: "NetworkAI workshop group photo" },
  { src: "/workshops/gallery/presenters-podium.jpg", alt: "Presenters at the podium" },
  { src: "/workshops/gallery/rag-presenter.jpg", alt: "Presenting What is RAG?" },
  { src: "/workshops/gallery/students-smiling.jpg", alt: "Students at the workshop" },
  { src: "/workshops/gallery/students-laptops.jpg", alt: "Students working on laptops" },
  { src: "/workshops/gallery/presenter-dual-screens.jpg", alt: "Presenter with dual screens" },
  { src: "/workshops/gallery/live-demo.jpg", alt: "Live demo session" },
  { src: "/workshops/gallery/full-room.jpg", alt: "Full room during announcements" },
  { src: "/workshops/gallery/helping-student.jpg", alt: "Presenter helping a student" },
];

const GALLERY_PAGE_SIZE = 9;

function WorkshopGallery() {
  const [page, setPage] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const totalPages = Math.ceil(galleryPhotos.length / GALLERY_PAGE_SIZE);
  const pageStart = page * GALLERY_PAGE_SIZE;
  const visiblePhotos = galleryPhotos.slice(pageStart, pageStart + GALLERY_PAGE_SIZE);

  const close = useCallback(() => setLightboxIndex(null), []);
  const prevPhoto = useCallback(
    () => setLightboxIndex((i) => (i !== null ? (i - 1 + galleryPhotos.length) % galleryPhotos.length : null)),
    [],
  );
  const nextPhoto = useCallback(
    () => setLightboxIndex((i) => (i !== null ? (i + 1) % galleryPhotos.length : null)),
    [],
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "ArrowRight") nextPhoto();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, close, prevPhoto, nextPhoto]);

  return (
    <>
      <section className="pb-24 px-6 border-t border-border/40">
        <div className="max-w-5xl mx-auto pt-16">
          <p className="text-sm font-semibold tracking-wide uppercase mb-3 text-indigo-400 text-center">
            Gallery
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-10 text-center">
            Workshop <span className="text-indigo-300">highlights</span>
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {visiblePhotos.map((photo, i) => (
              <button
                key={photo.src}
                type="button"
                className="group aspect-[4/3] w-full overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                onClick={() => setLightboxIndex(pageStart + i)}
                aria-label={`View ${photo.alt}`}>
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="h-full w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </button>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-full border border-border/60 bg-card/50 p-2 text-muted-foreground transition-colors hover:bg-indigo-500/10 hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                aria-label="Previous page">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm tabular-nums text-muted-foreground">
                {page + 1} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page === totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-full border border-border/60 bg-card/50 p-2 text-muted-foreground transition-colors hover:bg-indigo-500/10 hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                aria-label="Next page">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); close(); }}
            className="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white/80 transition-colors hover:bg-black/70 hover:text-white"
            aria-label="Close lightbox">
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
            className="absolute left-3 z-10 rounded-full bg-black/50 p-2 text-white/80 transition-colors hover:bg-black/70 hover:text-white sm:left-6"
            aria-label="Previous photo">
            <ChevronLeft className="h-6 w-6" />
          </button>

          <img
            src={galleryPhotos[lightboxIndex].src}
            alt={galleryPhotos[lightboxIndex].alt}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
            className="absolute right-3 z-10 rounded-full bg-black/50 p-2 text-white/80 transition-colors hover:bg-black/70 hover:text-white sm:right-6"
            aria-label="Next photo">
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-4 text-center text-sm text-white/60">
            {lightboxIndex + 1} / {galleryPhotos.length}
          </div>
        </div>
      )}
    </>
  );
}

const Workshops = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold tracking-wide uppercase mb-3 text-indigo-400">
            Events
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Upcoming <span className="text-indigo-300">workshops</span>
          </h1>
          <div className="mt-8 flex flex-col items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="border-indigo-400/50 bg-card/50 text-foreground hover:bg-indigo-500/10 hover:text-foreground"
              onClick={() => downloadAllWorkshopsIcs(ICS_ENTRIES)}>
              <CalendarPlus className="h-4 w-4 text-indigo-300" aria-hidden />
              Add all to calendar
            </Button>
          </div>
        </div>
      </section>

      <section className="pb-16 px-6">
        <div className="mx-auto max-w-4xl space-y-4">
          {workshops.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border/60 bg-card/40 p-5 sm:p-6 flex items-center gap-4 sm:gap-5">
              <WorkshopDateColumn calendar={item.calendar} />
              <h2 className="font-display min-w-0 flex-1 text-lg font-semibold text-foreground">{item.title}</h2>
              <WorkshopLogo />
            </div>
          ))}
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
            Past <span className="text-indigo-300">events</span>
          </h2>
          <ul className="divide-y divide-border/40 rounded-2xl border border-border/50 bg-card/30">
            {pastEvents.map((ev) => (
              <li key={ev.title} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4">
                <span className="w-28 shrink-0 text-sm tabular-nums text-muted-foreground">{ev.date}</span>
                <span className="min-w-0 flex-1 font-medium text-foreground">{ev.title}</span>
                {ev.slides ? (
                  <a
                    href={ev.slides.href}
                    download={ev.slides.filename}
                    className="group inline-flex items-center gap-2 rounded-lg border border-indigo-400/30 bg-indigo-500/10 px-2.5 py-1.5 text-xs font-medium text-foreground/90 transition-colors hover:border-indigo-400/60 hover:bg-indigo-500/15 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                    aria-label={`Download ${ev.slides.label} for ${ev.title}`}>
                    <FolderDown className="h-4 w-4 text-indigo-300" aria-hidden />
                    <span>{ev.slides.label}</span>
                    {ev.slides.sizeLabel ? (
                      <span className="text-[10px] text-muted-foreground">{ev.slides.sizeLabel}</span>
                    ) : null}
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <WorkshopGallery />

      <Footer />
    </div>
  );
};

export default Workshops;
