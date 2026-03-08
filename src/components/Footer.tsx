import { Mail } from "lucide-react";

const CLUB_EMAIL = "uwnetworkai@gmail.com";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/30 py-6 px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-1.5 text-sm text-muted-foreground text-center">
        <span>NetworkAI at the University of Washington</span>
        <span className="text-muted-foreground/90">A UW Foster School of Business affiliated RSO</span>
        <a
          href={`mailto:${CLUB_EMAIL}`}
          className="inline-flex items-center gap-1.5 text-foreground hover:text-indigo-300 transition-colors">
          <Mail className="w-4 h-4" />
          {CLUB_EMAIL}
        </a>
      </div>
    </footer>
  );
};

export default Footer;
