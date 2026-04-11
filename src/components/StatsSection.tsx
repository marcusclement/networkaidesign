const StatsSection = () => {
  return (
    <section className="relative z-10 py-16 border-y border-border/50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-indigo-400 mb-3">
          General meetings
        </p>
        <p className="font-display text-2xl md:text-3xl font-bold text-foreground leading-snug">
          Bi-monthly on Mondays
        </p>
        <p className="mt-2 text-base md:text-lg text-muted-foreground">
          6:30–7:30 PM · Paccar Hall
        </p>
      </div>
    </section>
  );
};

export default StatsSection;
