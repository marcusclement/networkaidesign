import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
          Ready to build?
        </h2>
        <p className="text-muted-foreground text-lg mb-10">
          Applications are open. Join the next generation of AI innovators and
          leaders.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/membership"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity bg-indigo-400">
            
            Apply Now
          </Link>
          <Link
            to="/leadership"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors">
            
            Learn More
          </Link>
        </div>
      </div>
    </section>);

};

export default CTASection;