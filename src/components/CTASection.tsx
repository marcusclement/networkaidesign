import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="relative flex min-h-[22rem] items-center overflow-hidden py-28 px-6 md:min-h-[28rem]">
      <div aria-hidden className="absolute inset-0">
        <img
          src="/workshops/gallery/group-photo.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[50%_77%] opacity-55 sm:object-[50%_73%] md:object-[50%_67%] lg:object-[50%_61%]"
        />
        <div className="absolute inset-0 bg-background/50" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-indigo-500/10" />
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
          Ready to build?
        </h2>
        <p className="text-foreground/85 text-lg mb-10 drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
          Applications are open. Join the next generation of AI innovators and
          leaders.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/membership"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity bg-indigo-400 shadow-lg shadow-indigo-500/20">
            Apply Now
          </Link>
          <Link
            to="/workshops"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-border bg-background/40 backdrop-blur-sm text-foreground font-semibold text-sm hover:bg-secondary transition-colors">
            Upcoming workshops
          </Link>
        </div>
      </div>
    </section>);

};

export default CTASection;
