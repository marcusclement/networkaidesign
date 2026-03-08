const stats = [
  { value: "1", label: "Organization" },
  { value: "Bi-Weekly", label: "Meetings" },
];

const StatsSection = () => {
  return (
    <section className="relative z-10 py-16 border-y border-border/50">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
