import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Linkedin, Instagram } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [instagramHovered, setInstagramHovered] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/60 backdrop-blur-xl border-b border-border/50">
      {/* SVG gradient def for Instagram icon (must be in DOM for url() to work) */}
      <svg aria-hidden className="absolute size-0 overflow-hidden">
        <defs>
          <linearGradient id="nav-instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F77737" />
            <stop offset="50%" stopColor="#FD1D1D" />
            <stop offset="100%" stopColor="#833AB4" />
          </linearGradient>
        </defs>
      </svg>
      <Link to="/" className="flex items-center gap-3">
        <img alt="NetworkAI" className="h-9 w-auto" src="/lovable-uploads/e21b4c4b-1e82-4c5a-876a-6968681e2aeb.png" />
        <span className="text-xl font-bold tracking-tight">
          Network<span className="text-indigo-300">AI</span>
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-3">
        <div className="flex items-center gap-1 bg-secondary/50 rounded-full px-2 py-1 border border-border/50">
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
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${isActive("/membership") ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            Membership
          </Link>
        </div>
        <a
          href="https://www.linkedin.com/company/networkai-university-of-washington/posts/?feedView=all"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-muted-foreground transition-transform duration-200 hover:scale-110 active:scale-95"
          aria-label="LinkedIn">
          <span
            className="absolute inset-0 scale-y-0 bg-[#0A66C2] origin-bottom transition-[transform] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-y-100"
            aria-hidden
          />
          <Linkedin
            className="relative z-10 h-5 w-5 transition-colors duration-300 group-hover:text-[#0A66C2]"
            strokeWidth={1.5}
          />
        </a>
        <a
          href="https://www.instagram.com/uw_networkai/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-muted-foreground transition-transform duration-200 hover:scale-110 active:scale-95"
          aria-label="Instagram"
          onMouseEnter={() => setInstagramHovered(true)}
          onMouseLeave={() => setInstagramHovered(false)}>
          <span
            className="absolute inset-0 scale-y-0 bg-gradient-to-t from-[#833AB4] via-[#FD1D1D] to-[#F77737] origin-bottom transition-[transform] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-y-100"
            aria-hidden
          />
          <Instagram
            className="relative z-10 h-5 w-5 transition-colors duration-300"
            strokeWidth={1.5}
            style={instagramHovered ? { stroke: "url(#nav-instagram-gradient)" } : undefined}
          />
        </a>
      </div>
    </nav>);

};

export default Navbar;