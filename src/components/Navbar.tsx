import { Link, useLocation } from "react-router-dom";
import logoImg from "@/assets/networkai-logo.png";

const Navbar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/60 backdrop-blur-xl border-b border-border/50">
      <Link to="/" className="flex items-center gap-2">
        <img alt="NetworkAI" className="h-9 w-auto" src="/lovable-uploads/e21b4c4b-1e82-4c5a-876a-6968681e2aeb.png" />
      </Link>

      <div className="hidden md:flex items-center gap-1 bg-secondary/50 rounded-full px-2 py-1 border border-border/50">
        <Link
          to="/"
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${isActive("/") ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
          Home
        </Link>
        <Link
          to="/leadership"
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${isActive("/leadership") ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
          Leadership
        </Link>
        <Link
          to="/membership"
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${isActive("/membership") ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>Membership

        </Link>
      </div>

      <Link
        to="/contact"
        className="hidden md:flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium border border-border text-foreground hover:bg-secondary transition-colors">
        
        Contact Us
      </Link>
    </nav>);

};

export default Navbar;