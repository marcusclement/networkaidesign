import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getDiscordInviteUrl } from "@/lib/links";
import { CalendarDays, ImageIcon } from "lucide-react";

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

/** Apr 13, 2026 6:30–8:00 PM Pacific (PDT, UTC−7). */
const VIBECODING_GCAL_URL = googleCalendarTemplateUrl({
  text: "NetworkAI — Vibecoding workshop",
  details:
    "Hands-on build session—bring your laptop. Hosted by UW NetworkAI.\n\n6:30–8:00 PM · PCAR 295 (Paccar Hall).",
  dates: "20260414T013000Z/20260414T030000Z",
  location: "PCAR 295",
});

const datePillClass =
  "shrink-0 mt-0.5 flex w-[4.75rem] flex-col items-center rounded-xl bg-primary/15 px-2.5 py-2 text-center sm:w-[5rem]";

const upcoming: {
  id: "vibecoding" | "mcp" | "ktp" | "bea";
  title: string;
  detail: string;
}[] = [
  {
    id: "vibecoding",
    title: "Vibecoding workshop",
    detail: "Hands-on build session—bring your laptop.",
  },
  {
    id: "mcp",
    title: "MCP workshop",
    detail: "Model Context Protocol and tooling for real workflows.",
  },
  {
    id: "ktp",
    title: "NetworkAI × KTP recruiter event",
    detail: "Connect with recruiters and learn how AI shows up in hiring.",
  },
  {
    id: "bea",
    title: "AI ethics with NetworkAI & Business Ethics Association",
    detail: "Joint session on responsible AI in business contexts.",
  },
];

function WorkshopDateColumn({ id }: { id: (typeof upcoming)[number]["id"] }) {
  if (id === "vibecoding") {
    return (
      <a
        href={VIBECODING_GCAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${datePillClass} ring-offset-background transition-colors hover:bg-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2`}
        aria-label="Add Vibecoding workshop to Google Calendar — Monday, April 13, 2026, 6:30 to 8:00 PM, PCAR 295">
        <CalendarDays className="mb-0.5 h-5 w-5 text-indigo-300" aria-hidden />
        <span className="text-[10px] font-semibold uppercase leading-none tracking-wide text-muted-foreground">
          Mon
        </span>
        <span className="mt-0.5 font-display text-sm font-bold leading-tight text-foreground">Apr 13</span>
        <span className="mt-1 text-[10px] font-medium leading-tight text-muted-foreground">6:30–8 PM</span>
        <span className="mt-0.5 text-[9px] leading-snug text-muted-foreground/90">PCAR 295</span>
      </a>
    );
  }
  return (
    <div className={datePillClass} aria-label="Date and time to be announced">
      <CalendarDays className="mb-0.5 h-5 w-5 text-indigo-300" aria-hidden />
      <span className="min-h-[0.75rem] text-[10px] font-semibold uppercase leading-none tracking-wide text-muted-foreground/25 select-none" aria-hidden>
        {"\u00a0"}
      </span>
      <span className="mt-0.5 min-h-[1.125rem] font-display text-sm font-bold leading-tight text-foreground/20 select-none" aria-hidden>
        {"\u00a0"}
      </span>
      <span className="mt-1 min-h-[0.875rem] text-[10px] text-muted-foreground/20 select-none" aria-hidden>
        {"\u00a0"}
      </span>
      <span className="mt-0.5 min-h-[0.75rem] text-[9px] text-muted-foreground/20 select-none" aria-hidden>
        {"\u00a0"}
      </span>
    </div>
  );
}

function WorkshopLogos({ id }: { id: (typeof upcoming)[number]["id"] }) {
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
          <img src="/workshops/ktp.png" alt="Kappa Theta Pi" className={logoClass} />
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

const Workshops = () => {
  const discordInviteUrl = getDiscordInviteUrl();

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
            Dates and RSVP links will be posted on Instagram as each event is finalized.
            {discordInviteUrl ? (
              <>
                {" "}
                Join our{" "}
                <a
                  href={discordInviteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-300 hover:text-indigo-200 underline-offset-4 hover:underline">
                  Discord
                </a>{" "}
                for reminders and details.
              </>
            ) : (
              <>
                {" "}
                Follow{" "}
                <a
                  href="https://www.instagram.com/uw_networkai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-300 hover:text-indigo-200 underline-offset-4 hover:underline">
                  @uw_networkai
                </a>{" "}
                for the Discord invite and updates.
              </>
            )}
          </p>
        </div>
      </section>

      <section className="pb-16 px-6">
        <div className="mx-auto max-w-4xl space-y-4">
          {upcoming.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border/60 bg-card/40 p-5 sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
              <div className="flex min-w-0 flex-1 gap-4">
                <WorkshopDateColumn id={item.id} />
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-lg font-semibold text-foreground mb-1">
                    {item.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.detail}</p>
                </div>
              </div>
              <WorkshopLogos id={item.id} />
            </div>
          ))}
        </div>
      </section>

      <section className="pb-24 px-6 border-t border-border/40">
        <div className="max-w-3xl mx-auto pt-16">
          <h2 className="font-display text-2xl font-bold text-foreground mb-3 text-center">
            Past workshops
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-10 max-w-xl mx-auto">
            After each event we&apos;ll add a photo and a short recap here so you can see what we covered.
          </p>
          <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 p-10 flex flex-col items-center gap-3 text-center">
            <ImageIcon className="w-10 h-10 text-muted-foreground/60" aria-hidden />
            <p className="text-sm text-muted-foreground max-w-md">
              No past workshops published yet. Check back after our first events of the quarter.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Workshops;
