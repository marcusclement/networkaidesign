import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getDiscordInviteUrl } from "@/lib/links";
import { CalendarDays, ImageIcon } from "lucide-react";

const NETWORKAI_LOGO = "/lovable-uploads/e21b4c4b-1e82-4c5a-876a-6968681e2aeb.png";

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

function WorkshopLogos({ id }: { id: (typeof upcoming)[number]["id"] }) {
  const logoClass = "h-9 w-9 sm:h-10 sm:w-10 object-contain opacity-95 hover:opacity-100 transition-opacity";
  const rowClass =
    "flex w-full shrink-0 items-center justify-end gap-4 sm:ml-auto sm:w-auto sm:justify-end sm:gap-5 sm:pt-0.5";

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
        <img src="/workshops/mcp.svg" alt="Model Context Protocol" className="h-10 w-10 sm:h-11 sm:w-11 object-contain opacity-95" />
      </div>
    );
  }
  if (id === "ktp") {
    return (
      <div className={rowClass}>
        <img src={NETWORKAI_LOGO} alt="NetworkAI" className={logoClass} />
        <img src="/workshops/ktp.png" alt="Kappa Theta Pi" className={logoClass} />
      </div>
    );
  }
  if (id === "bea") {
    return (
      <div className={rowClass}>
        <img src={NETWORKAI_LOGO} alt="NetworkAI" className={logoClass} />
        <img
          src="/workshops/bea.png"
          alt="Business Ethics Association"
          className="h-8 w-auto max-w-[7.5rem] object-contain object-left opacity-95 sm:h-9 sm:max-w-[8.5rem]"
        />
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
              <div className="flex gap-4 min-w-0 flex-1">
                <div className="shrink-0 mt-0.5 rounded-xl bg-primary/15 p-2.5">
                  <CalendarDays className="w-5 h-5 text-indigo-300" aria-hidden />
                </div>
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
