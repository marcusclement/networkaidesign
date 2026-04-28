import { useCallback, useEffect, useRef, useState } from "react";
import { Briefcase, Code2, Compass, Handshake, Newspaper, Sparkles, Users2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const MAX_TILT = 8;

type GoalItem = {
  icon: LucideIcon;
  title: string;
  detail: string;
};

const goalItems: GoalItem[] = [
  {
    icon: Code2,
    title: "Learn in-demand technical skills",
    detail:
      "Hands-on workshops covering the tools, frameworks, and AI workflows being used right now.",
  },
  {
    icon: Users2,
    title: "Collaborate across disciplines",
    detail: "Build alongside driven students from Business, Computer Science, and Informatics.",
  },
  {
    icon: Newspaper,
    title: "Stay current on AI",
    detail: "Track the news, models, and shifts shaping the industry as they happen.",
  },
  {
    icon: Compass,
    title: "Look ahead at where AI is going",
    detail: "Explore the trajectory of AI and what it means for the careers you'll step into.",
  },
  {
    icon: Briefcase,
    title: "Leverage AI in your career",
    detail: "Sharpen the skills that show up on resumes, in projects, and in real interviews.",
  },
  {
    icon: Handshake,
    title: "Network with industry professionals",
    detail: "Meet recruiters, alumni, and engineers actively building with AI.",
  },
];

const FeaturesSection = () => {
  const [tilts, setTilts] = useState<({ x: number; y: number } | null)[]>(
    () => goalItems.map(() => null),
  );
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [hasHover, setHasHover] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setHasHover(window.matchMedia("(hover: hover)").matches);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLLIElement>, index: number) => {
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

  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-5xl space-y-20">
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-8 md:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"
          />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Our approach
            </span>
            <p className="mt-5 text-lg leading-relaxed text-foreground md:text-xl">
              NetworkAI isn&apos;t about lectures—you have enough of those from class. We run{" "}
              <span className="font-medium text-indigo-300">interactive workshops</span> where every hour you invest is
              worth your time.
            </p>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Whether it&apos;s a website you just vibecoded, a skill you can use to streamline schoolwork, or a genuine
              connection with another ambitious member, you&apos;ll leave our workshops without thinking about the
              opportunity cost of your time.
            </p>
          </div>
        </div>

        <div>
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">What you&apos;ll get</p>
            <h2 className="font-display text-2xl font-bold leading-snug text-foreground md:text-3xl">
              A space to <span className="text-indigo-300">grow</span>, build, and connect.
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              NetworkAI is a growing community of students from Business, Computer Science, and Informatics. Here&apos;s
              what membership unlocks:
            </p>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {goalItems.map(({ icon: Icon, title, detail }, index) => {
              const tilt = tilts[index];
              return (
                <li
                  key={title}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  onMouseMove={hasHover ? (e) => handleMouseMove(e, index) : undefined}
                  onMouseLeave={hasHover ? () => handleMouseLeave(index) : undefined}
                  className="group relative rounded-2xl border border-border/50 bg-card/30 p-6 transition-colors hover:border-indigo-400/40 hover:bg-card/55"
                  style={{
                    transform: tilt
                      ? `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale3d(1.02, 1.02, 1.02)`
                      : "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)",
                    transition: "transform 0.15s ease-out, border-color 0.2s ease-out, background-color 0.2s ease-out",
                    transformStyle: "preserve-3d",
                  }}>
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300 transition-colors group-hover:bg-indigo-500/25">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{detail}</p>
                </li>
              );
            })}
          </ul>

          <p className="mt-12 text-center font-display text-xl font-semibold text-foreground md:text-2xl">
            Stay <span className="text-indigo-300">ahead of the curve</span> with NetworkAI.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
