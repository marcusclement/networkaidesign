import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, Lightbulb, CalendarCheck, Sparkles, Rocket } from "lucide-react";
import { toast } from "sonner";

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

const Membership = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tilts, setTilts] = useState<({ x: number; y: number } | null)[]>(
    qualities.map(() => null)
  );
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    setTilts((prev) => {
      const next = [...prev];
      next[index] = {
        x: Math.max(-1, Math.min(1, x)) * MAX_TILT,
        y: Math.max(-1, Math.min(1, y)) * -MAX_TILT,
      };
      return next;
    });
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

      {/* What we look for */}
      <section className="pb-16 px-6">
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

      {/* Application form */}
      <section className="pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-xl border border-border bg-card p-8">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              Apply Now
            </h2>

            {googleFormUrl ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            ) : submitted ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
                <CheckCircle className="w-12 h-12 text-primary" />
                <h3 className="font-display text-xl font-semibold text-foreground">
                  Application Received!
                </h3>
                <p className="text-muted-foreground text-sm">
                  Thank you for your interest. Our team will review your application and get back to you soon.
                </p>
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Web3Forms honeypot - hidden checkbox, must stay unchecked */}
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

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 w-full py-3 rounded-full text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity bg-indigo-400 hover:bg-indigo-300 disabled:opacity-60 disabled:pointer-events-none">
                  {submitting ? "Submitting…" : "Submit Application"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>);

};

export default Membership;