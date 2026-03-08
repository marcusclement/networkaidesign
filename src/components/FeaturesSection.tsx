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
      "Access the latest tools, research, and collaborative innovation platforms."
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "A vibrant, inclusive community fostering collaboration, mentorship, and shared success."
  }
];


const FeaturesSection = () => {
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
          {features.map((feature) =>
          <div
            key={feature.title}
            className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-[var(--shadow-glow)]">
            
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
          )}
        </div>
      </div>
    </section>);

};

export default FeaturesSection;