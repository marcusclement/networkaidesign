import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, Lightbulb, CalendarCheck, Sparkles, Rocket } from "lucide-react";
import { toast } from "sonner";
import { DISCORD_INVITE_URL } from "@/lib/links";

/** Discord mark (official-style glyph) for large CTAs. */
const DISCORD_ICON_PATH =
  "M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.876 19.876 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z";

// Link to your Google Form (opens in new tab). Env var overrides if you need to change it later.
const googleFormUrl =
  (import.meta.env.VITE_GOOGLE_FORM_EMBED_URL as string | undefined) ||
  "https://docs.google.com/forms/d/e/1FAIpQLSf6twmHTfZvgU-IX_uiUMBPvnLF5F0L5coFT8Rru0VvhfrvQA/viewform?usp=header";

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
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tilts, setTilts] = useState<({ x: number; y: number } | null)[]>(
    qualities.map(() => null)
  );
  const [discordTilt, setDiscordTilt] = useState<{ x: number; y: number } | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const discordCardRef = useRef<HTMLDivElement>(null);

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
    setDiscordTilt(tiltFromPointer(e.clientX, e.clientY, card, MAX_TILT));
  }, []);

  const handleDiscordMouseLeave = useCallback(() => {
    setDiscordTilt(null);
  }, []);

  const handleMouseLeave = useCallback((index: number) => {
    setTilts((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      toast.error("Form is not configured. Please set VITE_WEB3FORMS_ACCESS_KEY.");
      setError("Missing form configuration. On Vercel, add VITE_WEB3FORMS_ACCESS_KEY in Project Settings → Environment Variables, then redeploy.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const formData = new FormData(form);
      formData.set("access_key", accessKey);
      formData.set("subject", "NetworkAI Membership Application");
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        toast.success("Application submitted! We'll be in touch soon.");
      } else {
        const msg = data.message || "Something went wrong. Please try again.";
        setError(msg);
        toast.error("Submission failed. Please try again.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error. Please try again.";
      setError(msg);
      toast.error("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const discordRowClass =
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
      {!DISCORD_INVITE_URL && <p className="mt-4 text-sm text-muted-foreground/90">Discord will be up soon!</p>}
    </div>
  );

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
              className={`h-full rounded-2xl border p-8 md:p-10 transition-colors ${
                DISCORD_INVITE_URL
                  ? "border-[#5865F2]/45 bg-[#5865F2]/[0.12] hover:bg-[#5865F2]/[0.18] hover:border-[#5865F2]/60"
                  : "border-border bg-card/40"
              }`}
              style={{
                transform: discordTilt
                  ? `perspective(1000px) rotateX(${discordTilt.y}deg) rotateY(${discordTilt.x}deg) scale3d(1.02, 1.02, 1.02)`
                  : "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)",
                transition: "transform 0.15s ease-out",
              }}>
              {DISCORD_INVITE_URL ? (
                <a
                  href={DISCORD_INVITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${discordRowClass} no-underline`}
                  aria-label="Join our Discord">
                  {discordIconTile}
                  {discordCopy}
                </a>
              ) : (
                <div className={discordRowClass}>
                  {discordIconTile}
                  {discordCopy}
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0 lg:flex lg:flex-col">
            <div className="flex h-full min-h-0 flex-col rounded-xl border border-border bg-card p-8">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Apply Now</h2>

              {googleFormUrl ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 py-4 text-center">
                  <p className="text-muted-foreground">
                    Complete your membership application in our Google Form, no prior experience needed!
                  </p>
                  <a
                    href={googleFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm text-primary-foreground bg-indigo-400 hover:bg-indigo-300 transition-colors">
                    Open application form
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              ) : submitted ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 py-8 text-center">
                  <CheckCircle className="w-12 h-12 text-primary" />
                  <h3 className="font-display text-xl font-semibold text-foreground">Application Received!</h3>
                  <p className="text-muted-foreground text-sm">
                    Thank you for your interest. Our team will review your application and get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col gap-5">
                  <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} tabIndex={-1} aria-hidden />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" name="firstName" required placeholder="Jane" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" name="lastName" required placeholder="Doe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">UW Email *</Label>
                    <Input id="email" name="email" type="email" required placeholder="janedoe@uw.edu" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="206-555-1234" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn profile URL</Label>
                    <Input
                      id="linkedin"
                      name="linkedin"
                      type="url"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="major">Major / Year *</Label>
                    <Input id="major" name="major" required placeholder="e.g. Business Administration, Junior" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interest">Why are you interested in NetworkAI? *</Label>
                    <Textarea
                      id="interest"
                      name="interest"
                      required
                      rows={4}
                      placeholder="Tell us about your interest in AI and what you hope to gain..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Any relevant experience or skills?</Label>
                    <Textarea
                      id="experience"
                      name="experience"
                      rows={3}
                      placeholder="Projects, coursework, tools you've used..."
                    />
                  </div>

                  {error && <p className="text-sm text-destructive">{error}</p>}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-auto w-full py-3 rounded-full text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity bg-indigo-400 hover:bg-indigo-300 disabled:opacity-60 disabled:pointer-events-none">
                    {submitting ? "Submitting…" : "Submit Application"}
                  </button>
                </form>
              )}
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