import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useCallback, useRef } from "react";
import { Lightbulb, CalendarCheck, CalendarClock, Instagram, Sparkles, Rocket } from "lucide-react";
import { DISCORD_INVITE_URL } from "@/lib/links";

/** Discord mark (official-style glyph) for large CTAs. */
const DISCORD_ICON_PATH =
  "M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.876 19.876 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z";

const INSTAGRAM_URL = "https://www.instagram.com/uw_networkai/";

const qualities = [
  {
    icon: Lightbulb,
    title: "Curiosity",
    description: "Genuinely interested in how AI is reshaping your career landscape.",
  },
  {
    icon: CalendarCheck,
    title: "Committed",
    description: "If you sign up, show up.",
  },
  {
    icon: Sparkles,
    title: "Distinctive",
    description: "Show us what makes you stand out from other applicants.",
  },
  {
    icon: Rocket,
    title: "Innovative",
    description:
      "Give us new ideas, be creative, and walk us through your thought process on the application.",
  },
];

const MAX_TILT = 8;
/** ~69% less rotation than quality cards—large CTAs have links/buttons. */
const MEMBER_CARD_MAX_TILT = 2.5;
/** Gentler hover “lift” than the 1.02 used on smaller cards. */
const MEMBER_CARD_SCALE = 1.01;

function memberCardTransform(t: { x: number; y: number } | null) {
  if (!t) return "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
  const s = MEMBER_CARD_SCALE;
  return `perspective(1000px) rotateX(${t.y}deg) rotateY(${t.x}deg) scale3d(${s}, ${s}, ${s})`;
}

function tiltFromPointer(clientX: number, clientY: number, card: HTMLElement, maxTilt: number) {
  const rect = card.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const x = (clientX - centerX) / (rect.width / 2);
  const y = (clientY - centerY) / (rect.height / 2);
  return {
    x: Math.max(-1, Math.min(1, x)) * maxTilt,
    y: Math.max(-1, Math.min(1, y)) * -maxTilt,
  };
}

const Membership = () => {
  const [tilts, setTilts] = useState<({ x: number; y: number } | null)[]>(
    qualities.map(() => null)
  );
  const [discordTilt, setDiscordTilt] = useState<{ x: number; y: number } | null>(null);
  const [applyTilt, setApplyTilt] = useState<{ x: number; y: number } | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const discordCardRef = useRef<HTMLDivElement>(null);
  const applyCardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;
    const t = tiltFromPointer(e.clientX, e.clientY, card, MAX_TILT);
    setTilts((prev) => {
      const next = [...prev];
      next[index] = t;
      return next;
    });
  }, []);

  const handleDiscordMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = discordCardRef.current;
    if (!card) return;
    setDiscordTilt(tiltFromPointer(e.clientX, e.clientY, card, MEMBER_CARD_MAX_TILT));
  }, []);

  const handleDiscordMouseLeave = useCallback(() => {
    setDiscordTilt(null);
  }, []);

  const handleApplyMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = applyCardRef.current;
    if (!card) return;
    setApplyTilt(tiltFromPointer(e.clientX, e.clientY, card, MEMBER_CARD_MAX_TILT));
  }, []);

  const handleApplyMouseLeave = useCallback(() => {
    setApplyTilt(null);
  }, []);

  const handleMouseLeave = useCallback((index: number) => {
    setTilts((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  }, []);

  const memberRowClass =
    "relative flex min-w-0 flex-1 flex-col items-center gap-8 sm:flex-row sm:text-left";
  const discordIconTile = (
    <div className="group relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl text-muted-foreground shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95">
      <span
        className="absolute inset-0 scale-y-0 bg-[#5865F2] origin-bottom transition-[transform] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-y-100"
        aria-hidden
      />
      <svg
        className="relative z-10 h-16 w-16 transition-colors duration-300 group-hover:text-white"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden>
        <path d={DISCORD_ICON_PATH} />
      </svg>
    </div>
  );
  const discordCopy = (
    <div className="min-w-0 flex-1 text-center sm:text-left">
      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Join our Discord</h2>
      <p className="mt-3 text-muted-foreground leading-relaxed">
        That&apos;s where all club communication happens—announcements, events, workshop details, and questions between
        meetings.
      </p>
    </div>
  );

  const memberCardShellClass =
    "border-[#5865F2]/45 bg-[#5865F2]/[0.12] hover:bg-[#5865F2]/[0.18] hover:border-[#5865F2]/60";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Become a <span className="text-indigo-300">Member</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-primary-foreground">
            No coding or tech background needed. Whether you&apos;re in business, informatics, computer science,
            engineering, or any major, come explore how AI is shaping your field and learn in-demand AI skills that
            matter for your career. All curious Huskies welcome.
          </p>
        </div>
      </section>

      <section className="pb-16 px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2 lg:items-stretch">
          <div className="min-w-0 lg:flex lg:flex-col">
            <div
              ref={discordCardRef}
              onMouseMove={handleDiscordMouseMove}
              onMouseLeave={handleDiscordMouseLeave}
              className={`h-full rounded-2xl border p-8 md:p-10 transition-colors ${memberCardShellClass}`}
              style={{
                transform: memberCardTransform(discordTilt),
                transition: "transform 0.15s ease-out",
              }}>
              <a
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`${memberRowClass} no-underline`}
                aria-label="Join our Discord">
                {discordIconTile}
                {discordCopy}
              </a>
            </div>
          </div>

          <div className="min-w-0 lg:flex lg:flex-col">
            <div
              ref={applyCardRef}
              onMouseMove={handleApplyMouseMove}
              onMouseLeave={handleApplyMouseLeave}
              className={`flex h-full min-h-0 flex-col rounded-2xl border p-8 md:p-10 transition-colors ${memberCardShellClass}`}
              style={{
                transform: memberCardTransform(applyTilt),
                transition: "transform 0.15s ease-out",
              }}>
              <div className={memberRowClass}>
                <div className="group relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl text-muted-foreground shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95">
                  <span
                    className="absolute inset-0 scale-y-0 bg-indigo-500 origin-bottom transition-[transform] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-y-100"
                    aria-hidden
                  />
                  <CalendarClock
                    className="relative z-10 h-14 w-14 transition-colors duration-300 group-hover:text-white"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </div>
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">Membership applications</h2>
                  <p className="mt-3 text-lg font-medium text-foreground">Fall 2026 applications coming soon!</p>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    Spring applications are closed. Follow us on{" "}
                    <a
                      href={DISCORD_INVITE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-medium text-indigo-300 underline-offset-4 hover:underline">
                      <svg
                        className="h-4 w-4 shrink-0 opacity-90"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden>
                        <path d={DISCORD_ICON_PATH} />
                      </svg>
                      Discord
                    </a>{" "}
                    and{" "}
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-medium text-indigo-300 underline-offset-4 hover:underline">
                      <Instagram className="h-4 w-4 shrink-0 opacity-90" strokeWidth={1.75} aria-hidden />
                      Instagram
                    </a>{" "}
                    for updates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What we look for */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-foreground mb-8 text-center">
            What We're Looking For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {qualities.map((q, index) => (
              <div
                key={q.title}
                ref={(el) => { cardRefs.current[index] = el; }}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={() => handleMouseLeave(index)}
                className="rounded-xl border border-border bg-card p-5 text-center flex flex-col items-center gap-3"
                style={{
                  transform: tilts[index]
                    ? `perspective(1000px) rotateX(${tilts[index]!.y}deg) rotateY(${tilts[index]!.x}deg) scale3d(1.02, 1.02, 1.02)`
                    : "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)",
                  transition: "transform 0.15s ease-out",
                }}>
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <q.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-sm font-semibold text-foreground">
                  {q.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {q.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>);

};

export default Membership;