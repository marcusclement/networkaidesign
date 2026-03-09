import { useState, useCallback, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import seattleVideo from "@/assets/seattle-bg.mp4";

const MAGNETIC_RADIUS = 100;
const MAGNETIC_PULL = 12;

const HeroSection = () => {
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const [buttonOffset, setButtonOffset] = useState<{ join: { x: number; y: number }; team: { x: number; y: number } }>({
    join: { x: 0, y: 0 },
    team: { x: 0, y: 0 },
  });
  const sectionRef = useRef<HTMLElement>(null);
  const joinRef = useRef<HTMLSpanElement>(null);
  const teamRef = useRef<HTMLSpanElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    const clientX = e.clientX;
    const clientY = e.clientY;

    const computePull = (btn: HTMLElement | null) => {
      if (!btn) return { x: 0, y: 0 };
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > MAGNETIC_RADIUS) return { x: 0, y: 0 };
      const strength = 1 - dist / MAGNETIC_RADIUS;
      const pull = Math.min(strength * MAGNETIC_PULL, MAGNETIC_PULL);
      const nx = dist > 0 ? dx / dist : 0;
      const ny = dist > 0 ? dy / dist : 0;
      return { x: nx * pull, y: ny * pull };
    };

    setButtonOffset({
      join: computePull(joinRef.current),
      team: computePull(teamRef.current),
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouse(null);
    setButtonOffset({ join: { x: 0, y: 0 }, team: { x: 0, y: 0 } });
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

      {/* Cursor-following glow (desktop only) */}
      {mouse && (
        <div
          className="pointer-events-none absolute z-[1] h-[min(80vw,600px)] w-[min(80vw,600px)] rounded-full bg-indigo-500/20 blur-[80px] transition-opacity duration-300"
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
          <span
            ref={joinRef}
            className="inline-block"
            style={{
              transform: `translate(${buttonOffset.join.x}px, ${buttonOffset.join.y}px)`,
              transition: "transform 0.2s ease-out",
            }}>
            <Link
              to="/membership"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity text-primary-foreground bg-indigo-400">
              Join Us <ArrowRight className="w-4 h-4" />
            </Link>
          </span>
          <span
            ref={teamRef}
            className="inline-block"
            style={{
              transform: `translate(${buttonOffset.team.x}px, ${buttonOffset.team.y}px)`,
              transition: "transform 0.2s ease-out",
            }}>
            <Link
              to="/leadership"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-foreground font-semibold text-sm hover:text-primary transition-colors">
              Meet the Team
            </Link>
          </span>
        </div>
      </div>
    </section>);

};

export default HeroSection;