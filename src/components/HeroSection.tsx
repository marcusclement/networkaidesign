import { useState, useCallback, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import seattleVideo from "@/assets/seattle-bg.mp4";

const HeroSection = () => {
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouse(null);
  }, []);

  // Hide glow on touch devices (no hover) to avoid a stuck blob
  useEffect(() => {
    const isTouch = !window.matchMedia("(hover: hover)").matches;
    if (isTouch) setMouse(null);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}>
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover">
        
        <source src={seattleVideo} type="video/mp4" />
      </video>

      {/* Dark overlay to ensure text readability */}
      <div className="absolute inset-0 bg-background/80" />

      {/* Cursor-following glow (desktop only, subtle) */}
      {mouse && (
        <div
          className="pointer-events-none absolute z-[1] h-[min(40vw,300px)] w-[min(40vw,300px)] rounded-full bg-indigo-500/10 blur-[60px] transition-opacity duration-300"
          style={{
            left: mouse.x,
            top: mouse.y,
            transform: "translate(-50%, -50%)",
          }}
          aria-hidden
        />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-24">
        <div className="inline-flex items-center gap-2 mb-8">
          
          <span className="tracking-[0.2em] uppercase text-slate-300 bg-[#65758b]/0 font-bold text-base">

          </span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6 text-foreground">
          Connecting UW Students to{" "}
          <br />
          <span className="text-indigo-300">AI's Future.</span>
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed text-primary-foreground">
          A community for Huskies—networking, AI innovation, and professional development through hands-on projects and mentorship.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            to="/membership"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity text-primary-foreground bg-indigo-400">
            Join Us <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/leadership"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-foreground font-semibold text-sm hover:text-primary transition-colors">
            Meet the Team
          </Link>
        </div>
      </div>
    </section>);

};

export default HeroSection;