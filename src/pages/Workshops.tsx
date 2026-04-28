import { useState, useCallback, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { DISCORD_INVITE_URL } from "@/lib/links";
import { CalendarDays, CalendarPlus, FolderDown, X, ChevronLeft, ChevronRight } from "lucide-react";

const NETWORKAI_LOGO = "/lovable-uploads/e21b4c4b-1e82-4c5a-876a-6968681e2aeb.png";

/** Workshop row logos: prior square ×1.25, then ×1.5 more for layout headroom (≈4.22rem / 4.69rem). */
const LOGO_SQUARE = "h-[4.21875rem] w-[4.21875rem] sm:h-[4.6875rem] sm:w-[4.6875rem]";
const logoClass = `${LOGO_SQUARE} object-contain opacity-95 hover:opacity-100 transition-opacity`;

const mcpLogoClass =
  "h-[4.6875rem] w-[4.6875rem] sm:h-[5.15625rem] sm:w-[5.15625rem] rounded-md bg-white object-contain p-2 shadow-sm";

const beaLogoClass =
  "h-[3.75rem] w-auto max-w-[14.0625rem] object-contain object-left opacity-95 sm:h-[4.21875rem] sm:max-w-[15.9375rem]";

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
  href: string;
  weekday: string;
  dayMonth: string;
  time: string;
  place?: string;
  ariaLabel: string;
};

/** `dates` format: `DTSTART/DTEND` as `YYYYMMDDTHHmmssZ/...`. */
function parseIcsUtcTimestamp(s: string): Date {
  const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/.exec(s.trim());
  if (!m) return new Date(0);
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5]), Number(m[6])));
}

function isWorkshopPast(schedule: WorkshopSchedule): boolean {
  const parts = schedule.dates.split("/");
  if (parts.length < 2) return false;
  return Date.now() > parseIcsUtcTimestamp(parts[1]).getTime();
}

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
  a.download = "networkai-workshops-spring-2026.ics";
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

const workshopEntries: {
  id: "vibecoding" | "mcp" | "ktp" | "bea";
  title: string;
  detail: string;
  schedule: WorkshopSchedule;
  resources?: WorkshopResource[];
}[] = [
  {
    id: "vibecoding",
    title: "Vibecoding workshop",
    detail:
      "Learn how to create your own website! Hands-on build session, so bring your laptop. No technical experience required.",
    schedule: {
      text: "NetworkAI — Vibecoding workshop",
      details:
        "Learn how to create your own website! Hands-on build session, so bring your laptop. No technical experience required.\n\nHosted by UW NetworkAI.\n\n6:30–8:00 PM · PCAR 295 (Paccar Hall).",
      dates: "20260414T013000Z/20260414T030000Z",
      location: "PCAR 295",
      weekday: "Mon",
      dayMonth: "Apr 13",
      time: "6:30–8 PM",
      place: "PCAR 295",
      ariaLabel:
        "Add Vibecoding workshop to Google Calendar — Monday, April 13, 2026, 6:30 to 8:00 PM, PCAR 295",
    },
    resources: [
      {
        href: "/workshops/resources/networkai-info-night-slides.pptx",
        filename: "NetworkAI-Info-Night-Slides.pptx",
        label: "Slides (PPTX)",
        sizeLabel: "26 MB",
      },
    ],
  },
  {
    id: "mcp",
    title: "MCP workshop",
    detail:
      "Learn about Model Context Protocol and tooling for real workflows and automations.",
    schedule: {
      text: "NetworkAI — MCP workshop",
      details:
        "Learn about Model Context Protocol and tooling for real workflows and automations.\n\nHosted by UW NetworkAI.\n\n6:30–7:30 PM · PCAR 295 (Paccar Hall).",
      dates: "20260428T013000Z/20260428T023000Z",
      location: "PCAR 295",
      weekday: "Mon",
      dayMonth: "Apr 27",
      time: "6:30–7:30 PM",
      place: "PCAR 295",
      ariaLabel:
        "Add MCP workshop to Google Calendar — Monday, April 27, 2026, 6:30 to 7:30 PM, PCAR 295",
    },
    resources: [
      {
        href: "/workshops/resources/networkai-mcp-workshop-slides.pptx",
        filename: "NetworkAI-MCP-Workshop-Slides.pptx",
        label: "Slides (PPTX)",
        sizeLabel: "2.3 MB",
      },
    ],
  },
  {
    id: "ktp",
    title: "NetworkAI × KTP recruiter event",
    detail: "Connect with recruiters and learn how AI shows up in hiring.",
    schedule: {
      text: "NetworkAI × KTP recruiter event",
      details:
        "Connect with recruiters and learn how AI shows up in hiring.\n\nHosted by UW NetworkAI.\n\n6:00–7:30 PM · DEMP 004.",
      dates: "20260506T010000Z/20260506T023000Z",
      location: "DEMP 004",
      weekday: "Tue",
      dayMonth: "May 5",
      time: "6–7:30 PM",
      place: "DEMP 004",
      ariaLabel:
        "Add NetworkAI × KTP recruiter event to Google Calendar — Tuesday, May 5, 2026, 6:00 to 7:30 PM, DEMP 004",
    },
  },
  {
    id: "bea",
    title: "AI ethics with Business Ethics Association",
    detail: "Joint session on responsible AI in business contexts.",
    schedule: {
      text: "NetworkAI — AI ethics with Business Ethics Association",
      details: "Joint session on responsible AI in business contexts.\n\nHosted by UW NetworkAI.\n\n6:30–7:30 PM.",
      dates: "20260519T013000Z/20260519T023000Z",
      weekday: "Mon",
      dayMonth: "May 18",
      time: "6:30–7:30 PM",
      ariaLabel:
        "Add AI ethics with Business Ethics Association to Google Calendar — Monday, May 18, 2026, 6:30 to 7:30 PM",
    },
  },
];

const workshops = workshopEntries.map(({ id, title, detail, schedule, resources }) => ({
  id,
  title,
  detail,
  calendar: calendarFromSchedule(schedule),
  past: isWorkshopPast(schedule),
  resources,
}));

function WorkshopDateColumn({ calendar, past }: { calendar?: WorkshopCalendar; past?: boolean }) {
  if (!calendar) {
    return (
      <div className={datePillClass}>
        <CalendarDays className="mb-0.5 h-5 w-5 text-indigo-300" aria-hidden />
        <span className="text-[10px] font-semibold uppercase leading-none tracking-wide text-muted-foreground">TBD</span>
        <span className="mt-0.5 font-display text-sm font-bold leading-tight text-foreground">TBD</span>
        <span className="mt-1 text-[10px] font-medium leading-tight text-muted-foreground">TBD</span>
        <span className="mt-0.5 text-[9px] leading-snug text-muted-foreground/90">TBD</span>
      </div>
    );
  }

  const pillContent = (
    <>
      <CalendarDays className={`mb-0.5 h-5 w-5 ${past ? "text-muted-foreground/50" : "text-indigo-300"}`} aria-hidden />
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

  if (past) {
    return (
      <div className="flex shrink-0 flex-col items-center gap-1.5 rounded-lg text-center opacity-75">
        <span className={`${datePillClass} relative bg-muted/50`}>
          {pillContent}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <X className="h-full w-full p-1 text-muted-foreground/30" strokeWidth={1.5} />
          </span>
        </span>
        <span className="max-w-[6.5rem] text-balance text-[9px] leading-tight text-muted-foreground/60 sm:max-w-[7rem] sm:text-[10px]">
          This event has passed
        </span>
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

function WorkshopLogos({ id }: { id: (typeof workshops)[number]["id"] }) {
  const rowClass =
    "flex w-full shrink-0 items-center justify-end gap-6 sm:ml-auto sm:w-auto sm:justify-end sm:gap-8 sm:pt-0.5";

  if (id === "vibecoding") {
    return (
      <div className={rowClass}>
        <img src="/workshops/cursor.png" alt="Cursor" className={logoClass} />
        <img src="/workshops/lovable.png" alt="Lovable" className={logoClass} />
      </div>
    );
  }
  if (id === "mcp") {
    return (
      <div className={rowClass}>
        <img src="/workshops/mcp.png" alt="Model Context Protocol" className={mcpLogoClass} />
      </div>
    );
  }
  if (id === "ktp") {
    return (
      <div className={rowClass}>
        <img src={NETWORKAI_LOGO} alt="NetworkAI" className={logoClass} />
        <a
          href="https://ktp-uw-website.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 rounded-md ring-offset-background transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2">
          <span className={`relative inline-block overflow-hidden rounded-md ${LOGO_SQUARE}`}>
            <img
              src="/workshops/ktp.png"
              alt="Kappa Theta Pi"
              className="h-full w-full origin-top scale-[1.03] object-cover object-top"
            />
          </span>
        </a>
      </div>
    );
  }
  if (id === "bea") {
    return (
      <div className={rowClass}>
        <img src={NETWORKAI_LOGO} alt="NetworkAI" className={logoClass} />
        <a
          href="https://sites.google.com/view/uwbea/home"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 rounded-md ring-offset-background transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2">
          <img src="/workshops/bea.png" alt="Business Ethics Association" className={beaLogoClass} />
        </a>
      </div>
    );
  }
  return null;
}

const galleryPhotos = [
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

function WorkshopGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(
    () => setLightboxIndex((i) => (i !== null ? (i - 1 + galleryPhotos.length) % galleryPhotos.length : null)),
    [],
  );
  const next = useCallback(
    () => setLightboxIndex((i) => (i !== null ? (i + 1) % galleryPhotos.length : null)),
    [],
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, close, prev, next]);

  return (
    <>
      <section className="pb-24 px-6 border-t border-border/40">
        <div className="max-w-5xl mx-auto pt-16">
          <p className="text-sm font-semibold tracking-wide uppercase mb-3 text-indigo-400 text-center">
            Gallery
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3 text-center">
            Workshop <span className="text-indigo-300">highlights</span>
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-10 max-w-xl mx-auto">
            Snapshots from our hands-on sessions — building, learning, and connecting.
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {galleryPhotos.map((photo, i) => (
              <button
                key={photo.src}
                type="button"
                className="group aspect-[4/3] w-full overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                onClick={() => setLightboxIndex(i)}
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
            onClick={(e) => { e.stopPropagation(); prev(); }}
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
            onClick={(e) => { e.stopPropagation(); next(); }}
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
          <p className="text-muted-foreground text-lg leading-relaxed">
            Confirmed sessions are listed below. Follow us on Instagram for graphics and join our{" "}
            <a
              href={DISCORD_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-300 hover:text-indigo-200 underline-offset-4 hover:underline">
              Discord
            </a>{" "}
            for reminders.
          </p>
          <div className="mt-8 flex flex-col items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="border-indigo-400/50 bg-card/50 text-foreground hover:bg-indigo-500/10 hover:text-foreground"
              onClick={() => downloadAllWorkshopsIcs(workshopEntries)}>
              <CalendarPlus className="h-4 w-4 text-indigo-300" aria-hidden />
              Add all to calendar
            </Button>
            <p className="max-w-md text-balance text-xs leading-relaxed text-muted-foreground">
              Downloads one <span className="whitespace-nowrap">.ics</span> file. Open it or use Google
              Calendar&apos;s{" "}
              <a
                href="https://calendar.google.com/calendar/u/0/r/settings/export"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-300 underline-offset-2 hover:underline">
                Import
              </a>{" "}
              to add every workshop at once.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 px-6">
        <div className="mx-auto max-w-4xl space-y-4">
          {workshops.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-5 sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5 ${
                item.past
                  ? "border-border/35 bg-muted/15"
                  : "border-border/60 bg-card/40"
              }`}>
              <div className="flex min-w-0 flex-1 gap-4">
                <WorkshopDateColumn calendar={item.calendar} past={item.past} />
                <div className="min-w-0 flex-1">
                  <h2 className="font-display mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-lg font-semibold text-foreground">
                    <span className={`relative inline ${item.past ? "text-muted-foreground" : ""}`}>
                      {item.title}
                      {item.past ? (
                        <span
                          aria-hidden
                          className="pointer-events-none absolute left-[-2px] right-[-2px] top-[53%] h-[2px] -translate-y-[1px] -rotate-[0.5deg] origin-left scale-x-0 bg-gradient-to-r from-indigo-400/70 via-indigo-400/50 to-indigo-400/70 motion-reduce:scale-x-100 motion-reduce:animate-none animate-strike-expand"
                        />
                      ) : null}
                    </span>
                    {item.past ? (
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Completed
                      </span>
                    ) : null}
                  </h2>
                  <p
                    className={`text-sm leading-relaxed text-muted-foreground ${
                      item.past ? "opacity-[0.97]" : ""
                    }`}>
                    {item.id === "vibecoding" ? (
                      <>
                        Learn how to create your own website! Hands-on build session, so bring your laptop.{" "}
                        <em>No technical experience required.</em>
                      </>
                    ) : (
                      item.detail
                    )}
                  </p>
                  {item.resources && item.resources.length > 0 ? (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-indigo-300/90">
                        <FolderDown className="h-3.5 w-3.5" aria-hidden />
                        Workshop resources
                      </span>
                      {item.resources.map((r) => (
                        <a
                          key={r.href}
                          href={r.href}
                          download={r.filename}
                          className="group inline-flex items-center gap-2 rounded-lg border border-indigo-400/30 bg-indigo-500/10 px-2.5 py-1.5 text-xs font-medium text-foreground/90 transition-colors hover:border-indigo-400/60 hover:bg-indigo-500/15 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          aria-label={`Download ${r.label} for ${item.title}`}>
                          <FolderDown
                            className="h-4 w-4 text-indigo-300 transition-transform group-hover:translate-y-[1px]"
                            aria-hidden
                          />
                          <span>{r.label}</span>
                          {r.sizeLabel ? (
                            <span className="text-[10px] text-muted-foreground">{r.sizeLabel}</span>
                          ) : null}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className={item.past ? "opacity-[0.92]" : undefined}>
                <WorkshopLogos id={item.id} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <WorkshopGallery />

      <Footer />
    </div>
  );
};

export default Workshops;
