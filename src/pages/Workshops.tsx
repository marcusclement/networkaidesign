import { useState, useCallback, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CalendarDays, CalendarPlus, FolderDown, X, ChevronLeft, ChevronRight } from "lucide-react";

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

type WorkshopResource = {
  href: string;
  filename: string;
  label: string;
  sizeLabel?: string;
};

type WorkshopEntry = {
  id: string;
  title: string;
  /** One per session; each gets its own calendar button and .ics event. */
  schedules: WorkshopSchedule[];
};

const workshopEntries: WorkshopEntry[] = [
  {
    id: "agentic-ai",
    title: "Agentic AI",
    schedules: [
      {
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
    ],
  },
  {
    id: "case-competition",
    title: "Innovation Case Competition",
    schedules: [
      {
        text: "NetworkAI — Innovation Case Competition (Day 1)",
        details: "Hosted by UW NetworkAI.\n\n6:00–7:30 PM · Room TBD.",
        dates: "20261106T020000Z/20261106T033000Z",
        weekday: "Thu",
        dayMonth: "Nov 5",
        time: "6–7:30 PM",
        place: "Room TBD",
        ariaLabel: "Add Innovation Case Competition day 1 to Google Calendar — Thursday, November 5, 2026, 6 to 7:30 PM, room TBD",
      },
      {
        text: "NetworkAI — Innovation Case Competition (Day 2)",
        details: "Hosted by UW NetworkAI.\n\n2:00–5:00 PM · Room TBD.",
        dates: "20261106T220000Z/20261107T010000Z",
        weekday: "Fri",
        dayMonth: "Nov 6",
        time: "2–5 PM",
        place: "Room TBD",
        ariaLabel: "Add Innovation Case Competition day 2 to Google Calendar — Friday, November 6, 2026, 2 to 5 PM, room TBD",
      },
    ],
  },
  {
    id: "recruiter-event",
    title: "Recruiter Event",
    schedules: [
      {
        text: "NetworkAI — Recruiter Event",
        details: "Hosted by UW NetworkAI.\n\n5:30–6:30 PM · PCAR 295 (Paccar Hall).",
        dates: "20261117T013000Z/20261117T023000Z",
        location: "PCAR 295",
        weekday: "Mon",
        dayMonth: "Nov 16",
        time: "5:30–6:30 PM",
        place: "PCAR 295",
        ariaLabel: "Add Recruiter Event to Google Calendar — Monday, November 16, 2026, 5:30 to 6:30 PM, PCAR 295",
      },
    ],
  },
  {
    id: "enterprise-ai",
    title: "Enterprise AI Workshop",
    schedules: [
      {
        text: "NetworkAI — Enterprise AI Workshop",
        details: "Hosted by UW NetworkAI.\n\n5:30–6:30 PM · Room TBD.",
        dates: "20261124T013000Z/20261124T023000Z",
        weekday: "Mon",
        dayMonth: "Nov 23",
        time: "5:30–6:30 PM",
        place: "Room TBD",
        ariaLabel: "Add Enterprise AI Workshop to Google Calendar — Monday, November 23, 2026, 5:30 to 6:30 PM, room TBD",
      },
    ],
  },
];

const ICS_ENTRIES = workshopEntries.flatMap((e) =>
  e.schedules.map((schedule, i) => ({ id: e.schedules.length > 1 ? `${e.id}-${i + 1}` : e.id, schedule })),
);

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

function WorkshopDetails({ schedules }: { schedules: WorkshopSchedule[] }) {
  return (
    <ul className="mt-1.5 space-y-1.5 text-sm">
      {schedules.map((s) => (
        <li key={s.dates}>
          <p className="flex items-center gap-1.5 font-medium text-foreground/90">
            <CalendarDays className="h-4 w-4 shrink-0 text-indigo-300" aria-hidden />
            {s.weekday}, {s.dayMonth}
          </p>
          <p className="pl-[1.375rem] text-muted-foreground">{[s.time, s.place].filter(Boolean).join(" · ")}</p>
        </li>
      ))}
    </ul>
  );
}

function AddToCalendarButtons({ schedules }: { schedules: WorkshopSchedule[] }) {
  const multiple = schedules.length > 1;
  return (
    <div className="flex shrink-0 flex-col gap-2">
      {schedules.map((s) => (
        <a
          key={s.dates}
          href={googleCalendarTemplateUrl(s)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.ariaLabel}
          className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-400/30 bg-indigo-500/10 px-3 py-2 text-xs font-medium text-foreground/90 transition-colors hover:border-indigo-400/60 hover:bg-indigo-500/20 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
          <CalendarPlus className="h-4 w-4 text-indigo-300" aria-hidden />
          {multiple ? `Add ${s.weekday} to calendar` : "Add to calendar"}
        </a>
      ))}
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
      <section className="pb-16 px-6 border-t border-border/40">
        <div className="max-w-5xl mx-auto pt-12">
          <p className="text-sm font-semibold tracking-wide uppercase mb-3 text-indigo-400 text-center">
            Gallery
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
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

      <section className="pt-28 pb-8 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold tracking-wide uppercase mb-3 text-indigo-400">
            Events
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Upcoming <span className="text-indigo-300">workshops</span>
          </h1>
          <div className="mt-6 flex flex-col items-center gap-2">
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

      <section className="pb-12 px-6">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
          {workshopEntries.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border/60 bg-card/40 p-5 flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-lg font-semibold text-foreground">{item.title}</h2>
                <WorkshopDetails schedules={item.schedules} />
              </div>
              <AddToCalendarButtons schedules={item.schedules} />
            </div>
          ))}
        </div>
      </section>

      <section className="pb-14 px-6">
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
