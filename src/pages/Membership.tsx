import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, Users, Lightbulb, Rocket, GraduationCap } from "lucide-react";
import { toast } from "sonner";

const qualities = [
{
  icon: Lightbulb,
  title: "Curiosity about AI",
  description: "A genuine interest in how AI is reshaping industries and everyday life."
},
{
  icon: Users,
  title: "Team Player",
  description: "Willingness to collaborate, share ideas, and support fellow members."
},
{
  icon: Rocket,
  title: "Initiative & Drive",
  description: "Proactive individuals who take ownership and contribute meaningfully."
},
{
  icon: GraduationCap,
  title: "Growth Mindset",
  description: "Eagerness to learn, attend workshops, and develop new skills."
}];


const Membership = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            Join a community of ambitious students passionate about AI, technology, and innovation at UW.
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
            {qualities.map((q) =>
            <div
              key={q.title}
              className="rounded-xl border border-border bg-card p-5 text-center flex flex-col items-center gap-3">
              
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
            )}
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

            {submitted ?
            <div className="flex flex-col items-center gap-4 py-12 text-center">
                <CheckCircle className="w-12 h-12 text-primary" />
                <h3 className="font-display text-xl font-semibold text-foreground">
                  Application Received!
                </h3>
                <p className="text-muted-foreground text-sm">
                  Thank you for your interest. Our team will review your application and get back to you soon.
                </p>
              </div> :

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
            }
          </div>
        </div>
      </section>
      <Footer />
    </div>);

};

export default Membership;