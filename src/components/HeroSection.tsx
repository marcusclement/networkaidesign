import { useState, useCallback, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import seattleVideo from "@/assets/seattle-bg.mp4";
import uwCampusVideo from "@/assets/uw-campus-bg.mp4";

const videos = [seattleVideo, uwCampusVideo];

const HeroSection = () => {
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(() => Math.random() < 0.5 ? 0 : 1);
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);

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

  // Cycle videos every 12 seconds with a crossfade
  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % videos.length);
        setFading(false);
      }, 1000); // 1s crossfade
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}>
      {/* Video Background – crossfade between clips */}
      {videos.map((src, i) => (
        <video
          key={src}
          ref={i === activeIndex ? videoRef : nextVideoRef}
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === activeIndex && !fading ? "opacity-100" : "opacity-0"
          }`}
          src={src}
        />
      ))}

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
        <p className="text-sm md:text-base text-primary-foreground/90 max-w-2xl mx-auto mb-6 leading-relaxed">
          The University of Washington&apos;s premier undergraduate AI in Business club.
        </p>

        <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-10 text-foreground">
          Network<span className="text-indigo-300">AI</span>
        </h1>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/membership"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity text-primary-foreground bg-indigo-400">
            Join Us <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/workshops"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-border text-foreground font-semibold text-sm hover:bg-secondary/80 transition-colors">
            Upcoming workshops
          </Link>
        </div>
      </div>
    </section>);

};

export default HeroSection;