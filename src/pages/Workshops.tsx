import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getDiscordInviteUrl } from "@/lib/links";
import { CalendarDays, ImageIcon } from "lucide-react";

const upcoming = [
  {
    title: "Vibecoding workshop",
    detail: "Hands-on build session—bring your laptop.",
  },
  {
    title: "MCP workshop",
    detail: "Model Context Protocol and tooling for real workflows.",
  },
  {
    title: "NetworkAI × KTP recruiter event",
    detail: "Connect with recruiters and learn how AI shows up in hiring.",
  },
  {
    title: "AI ethics with NetworkAI & Business Ethics Association",
    detail: "Joint session on responsible AI in business contexts.",
  },
];

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
        <div className="max-w-3xl mx-auto space-y-4">
          {upcoming.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border/60 bg-card/40 p-6 flex gap-4 items-start">
              <div className="shrink-0 mt-0.5 rounded-xl bg-primary/15 p-2.5">
                <CalendarDays className="w-5 h-5 text-indigo-300" aria-hidden />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground mb-1">
                  {item.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.detail}</p>
              </div>
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
