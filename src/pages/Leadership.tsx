import { useState, useCallback, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Linkedin, Globe } from "lucide-react";

const MAX_TILT = 8;

const leaders = [
  {
    name: "Sarah Greenberg",
    email: "sarahg89@uw.edu",
    linkedin: "https://www.linkedin.com/in/sarah-greenberg1/",
    photo: "sarah-greenberg.jpeg",
    role: "President",
    grade: "Junior",
    major: "Finance and Supply Chain Management",
    funFact: "I'm an avid bachata and salsa dancer!"
  },
  {
    name: "Kaspar Marwick",
    email: "kmarwick@uw.edu",
    linkedin: "https://www.linkedin.com/in/kaspar-marwick-97b0a418a/",
    photo: "kaspar-marwick.jpeg",
    role: "Vice-President",
    grade: "Sophomore",
    major: "Finance and Supply Chain Management",
    funFact: "I'm a national level gymnast and a violinist in the UW orchestra."
  },
  {
    name: "Marcus Clement",
    email: "marcus20@uw.edu",
    linkedin: "https://www.linkedin.com/in/marcus-clement27/",
    website: "https://marcusclementportfolio.vercel.app/",
    photo: "marcus-clement.jpeg",
    role: "Director of Technology & AI",
    grade: "Junior",
    major: "Informatics",
    funFact: "I love hiking and have done 30+ hikes in Washington!"
  },
  {
    name: "Raya Rehmat",
    email: "rayar@uw.edu",
    linkedin: "https://www.linkedin.com/in/raya-r-rehmat/",
    website: "https://www.rehmat.com/",
    photo: "raya-rehmat.jpeg",
    role: "Director of Marketing",
    grade: "Sophomore",
    major: "Marketing and Dance",
    funFact: "I swam with dolphins in the Bahamas!"
  },
  {
    name: "Alarick Alfredo-Sorto",
    email: "alarick@uw.edu",
    linkedin: "https://www.linkedin.com/in/alarick-alfredo-sorto/",
    photo: "alarick-alfredo-sorto.jpeg",
    role: "Director of Operations",
    grade: "Sophomore",
    major: "Accounting",
    funFact: "I studied abroad throughout all of high school!"
  },
  {
    name: "Milana Trigubova",
    email: "milant3@uw.edu",
    linkedin: "https://www.linkedin.com/in/milana-trigubova/",
    photo: "milana-trigubova.jpeg",
    role: "Director of Events",
    grade: "Sophomore",
    major: "Finance and Information Systems",
    funFact: "I was born at a very young age."
  },
  {
    name: "Lucia Fernandez-Binder",
    email: "luciafb@uw.edu",
    linkedin: "https://www.linkedin.com/in/lucia-fernandez-binder/",
    photo: "lucia-fernandez-binder.jpeg",
    role: "Director of Strategy & Outreach",
    grade: "Senior",
    major: "Business Information Systems",
    funFact: "I can speak 3 languages!"
  },
  {
    name: "Diya Shah",
    email: "dshah16@uw.edu",
    linkedin: "https://www.linkedin.com/in/diya-shah16/",
    photo: "diya-shah.jpeg",
    role: "Director of Finance",
    grade: "Freshman",
    major: "Finance and Marketing",
    funFact: "I've been dancing for 10+ years and love cooking and eating pasta!"
  }
];


const Leadership = () => {
  const [tilts, setTilts] = useState<({ x: number; y: number } | null)[]>(
    leaders.map(() => null)
  );
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    setTilts((prev) => {
      const next = [...prev];
      next[index] = {
        x: Math.max(-1, Math.min(1, x)) * MAX_TILT,
        y: Math.max(-1, Math.min(1, y)) * -MAX_TILT,
      };
      return next;
    });
  }, []);

  const handleMouseLeave = useCallback((index: number) => {
    setTilts((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our <span className="text-indigo-300">Leadership</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-primary-foreground">
            Meet the executive team driving NetworkAI forward at the University
            of Washington.
          </p>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leaders.map((leader, index) => (
            <div
              key={leader.email}
              ref={(el) => { cardRefs.current[index] = el; }}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => handleMouseLeave(index)}
              className="rounded-xl border border-border bg-card p-6 flex flex-col gap-3 hover:border-primary/40 transition-colors"
              style={{
                transform: tilts[index]
                  ? `perspective(1000px) rotateX(${tilts[index]!.y}deg) rotateY(${tilts[index]!.x}deg) scale3d(1.02, 1.02, 1.02)`
                  : "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)",
                transition: "transform 0.15s ease-out",
              }}>
            
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-primary/20 shrink-0">
                <span className="absolute inset-0 flex items-center justify-center font-display font-bold text-xl text-indigo-300">
                  {leader.name.split(" ").map((n) => n[0]).join("")}
                </span>
                {leader.photo && (
                  <img
                    src={`/leadership/${leader.photo}`}
                    alt={leader.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {leader.name}
                </h3>
                <p className="text-sm font-medium text-indigo-300">{leader.role}</p>
                {leader.grade && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    <span className="font-medium">Grade:</span> {leader.grade}
                  </p>
                )}
                {leader.major && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Major:</span> {leader.major}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Fun fact</p>
                {leader.funFact ? (
                  <p className="text-sm text-muted-foreground leading-relaxed">{leader.funFact}</p>
                ) : null}
              </div>
              <div className="flex flex-col gap-1.5 pt-2 border-t border-border">
                <a
                  href={`mailto:${leader.email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                  {leader.email}
                </a>
                <div className="flex items-center gap-2 mt-1">
                  {leader.linkedin && (
                    <a
                      href={leader.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-muted-foreground transition-transform duration-200 hover:scale-110 active:scale-95"
                      aria-label={`${leader.name} on LinkedIn`}>
                      <span
                        className="absolute inset-0 scale-y-0 bg-[#0A66C2] origin-bottom transition-[transform] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-y-100"
                        aria-hidden
                      />
                      <Linkedin
                        className="relative z-10 h-5 w-5 transition-colors duration-300 group-hover:text-white"
                        strokeWidth={1.5}
                      />
                    </a>
                  )}
                  {leader.website && (
                    <a
                      href={leader.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-muted-foreground transition-transform duration-200 hover:scale-110 active:scale-95"
                      aria-label={`${leader.name} portfolio`}>
                      <span
                        className="absolute inset-0 scale-y-0 bg-indigo-500 origin-bottom transition-[transform] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-y-100"
                        aria-hidden
                      />
                      <Globe
                        className="relative z-10 h-5 w-5 transition-colors duration-300 group-hover:text-white"
                        strokeWidth={1.5}
                      />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>);

};

export default Leadership;