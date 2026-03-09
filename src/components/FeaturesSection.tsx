import { useState, useCallback, useRef } from "react";
import { Globe, Zap, Users } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Global Network",
    description:
      "Connect with professionals and organizations worldwide through our expansive network."
  },
  {
    icon: Zap,
    title: "Rapid Innovation",
    description:
      "Gain access and knowledge on the latest trends in the AI space."
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "A vibrant, inclusive community fostering collaboration, mentorship, and shared success."
  }
];

const MAX_TILT = 8;

const FeaturesSection = () => {
  const [tilts, setTilts] = useState<({ x: number; y: number } | null)[]>([null, null, null]);
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

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold tracking-wide uppercase mb-3 text-indigo-400">
            What We Do
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            More Than a Network.
            <br />
            <span className="text-violet-300">A Launchpad.</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            We bridge the gap between academic theory and the blistering pace of
            the AI world.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              ref={(el) => { cardRefs.current[index] = el; }}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => handleMouseLeave(index)}
              className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-[var(--shadow-glow)]"
              style={{
                transform: tilts[index]
                  ? `perspective(1000px) rotateX(${tilts[index]!.y}deg) rotateY(${tilts[index]!.x}deg) scale3d(1.02, 1.02, 1.02)`
                  : "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)",
                transition: "transform 0.15s ease-out",
              }}>
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>);

};

export default FeaturesSection;