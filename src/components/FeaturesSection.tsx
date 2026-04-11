const goalItems = [
  "Learn technical skills in demand",
  "Collaborate with driven students across disciplines",
  "Keep up with current AI events",
  "Learn about the future of AI",
  "Leverage AI in your career",
  "Network with industry professionals",
];

const FeaturesSection = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto space-y-16">
        <div className="rounded-2xl border border-border/50 bg-card/30 p-8 md:p-10">
          <p className="text-lg md:text-xl text-foreground leading-relaxed">
            NetworkAI isn&apos;t about lectures—you have enough lectures from classes. We provide{" "}
            <span className="text-indigo-300 font-medium">interactive workshops</span> where every hour you invest
            is worth your time.
          </p>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Whether it&apos;s a website you just vibecoded, a technical skill you can use to streamline schoolwork, or
            a genuine connection with another ambitious member, you&apos;ll leave our workshops without thinking about
            the opportunity cost of your time.
          </p>
        </div>

        <div className="space-y-6">
          <p className="text-lg text-foreground leading-relaxed">
            NetworkAI is a growing community of students from Business, Computer Science, and Informatics majors.
          </p>
          <p className="text-foreground font-display text-xl font-semibold">
            Our goal is to provide a space where you can:
          </p>
          <ul className="space-y-3 pl-1">
            {goalItems.map((item) => (
              <li key={item} className="flex gap-3 text-muted-foreground leading-relaxed">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="pt-4 font-display text-xl font-semibold text-foreground">
            Stay ahead of the curve with NetworkAI.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
