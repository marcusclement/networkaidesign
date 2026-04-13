import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Linkedin, Instagram } from "lucide-react";
import { DISCORD_INVITE_URL } from "@/lib/links";

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
        <div className="flex items-center gap-1 bg-secondary/30 rounded-full px-1.5 py-1 border border-border/50">
          <Link
            to="/"
            className={`group relative px-4 py-2 rounded-full text-sm font-semibold tracking-tight overflow-hidden transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] ${isActive("/") ? "text-foreground" : "text-muted-foreground"}`}>
            {isActive("/") && (
              <span className="absolute inset-0 rounded-full bg-indigo-500/20 border border-indigo-400/30" aria-hidden />
            )}
            <span className="absolute inset-0 rounded-full scale-x-0 bg-indigo-500/15 origin-center transition-[transform] duration-300 ease-out group-hover:scale-x-100" aria-hidden />
            <span className="relative z-10 block transition-colors duration-200 group-hover:text-foreground">
              Home
            </span>
          </Link>
          <Link
            to="/workshops"
            className={`group relative px-4 py-2 rounded-full text-sm font-semibold tracking-tight overflow-hidden transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] ${isActive("/workshops") ? "text-foreground" : "text-muted-foreground"}`}>
            {isActive("/workshops") && (
              <span className="absolute inset-0 rounded-full bg-indigo-500/20 border border-indigo-400/30" aria-hidden />
            )}
            <span className="absolute inset-0 rounded-full scale-x-0 bg-indigo-500/15 origin-center transition-[transform] duration-300 ease-out group-hover:scale-x-100" aria-hidden />
            <span className="relative z-10 block transition-colors duration-200 group-hover:text-foreground">
              Workshops
            </span>
          </Link>
          <Link
            to="/leadership"
            className={`group relative px-4 py-2 rounded-full text-sm font-semibold tracking-tight overflow-hidden transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] ${isActive("/leadership") ? "text-foreground" : "text-muted-foreground"}`}>
            {isActive("/leadership") && (
              <span className="absolute inset-0 rounded-full bg-indigo-500/20 border border-indigo-400/30" aria-hidden />
            )}
            <span className="absolute inset-0 rounded-full scale-x-0 bg-indigo-500/15 origin-center transition-[transform] duration-300 ease-out group-hover:scale-x-100" aria-hidden />
            <span className="relative z-10 block transition-colors duration-200 group-hover:text-foreground">
              Leadership
            </span>
          </Link>
          <Link
            to="/membership"
            className={`group relative px-4 py-2 rounded-full text-sm font-semibold tracking-tight overflow-hidden transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] ${isActive("/membership") ? "text-foreground" : "text-muted-foreground"}`}>
            {isActive("/membership") && (
              <span className="absolute inset-0 rounded-full bg-indigo-500/20 border border-indigo-400/30" aria-hidden />
            )}
            <span className="absolute inset-0 rounded-full scale-x-0 bg-indigo-500/15 origin-center transition-[transform] duration-300 ease-out group-hover:scale-x-100" aria-hidden />
            <span className="relative z-10 block transition-colors duration-200 group-hover:text-foreground">
              Membership
            </span>
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
            className="relative z-10 h-5 w-5 transition-colors duration-300 group-hover:text-white"
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
        <a
          href={DISCORD_INVITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-muted-foreground transition-transform duration-200 hover:scale-110 active:scale-95"
          aria-label="Discord"
          title="Discord">
          <span
            className="absolute inset-0 scale-y-0 bg-[#5865F2] origin-bottom transition-[transform] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-y-100"
            aria-hidden
          />
          <svg
            className="relative z-10 h-5 w-5 transition-colors duration-300 group-hover:text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden>
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.876 19.876 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
        </a>
      </div>
    </nav>);

};

export default Navbar;