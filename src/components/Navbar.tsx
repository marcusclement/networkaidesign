import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/60 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full border border-primary/50 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-primary" />
        </div>
        <span className="font-display text-lg font-semibold text-foreground">
          Network<span className="text-primary">AI</span>
        </span>
      </div>

      <div className="hidden md:flex items-center gap-1 bg-secondary/50 rounded-full px-2 py-1 border border-border/50">
        <Link
          to="/"
          className="px-4 py-1.5 rounded-full text-sm font-medium bg-secondary text-foreground"
        >
          Home
        </Link>
        <Link
          to="/leadership"
          className="px-4 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Leadership
        </Link>
        <Link
          to="/membership"
          className="px-4 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Become a Member
        </Link>
      </div>

      <Link
        to="/contact"
        className="hidden md:flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium border border-border text-foreground hover:bg-secondary transition-colors"
      >
        Contact Us
      </Link>
    </nav>
  );
};

export default Navbar;
