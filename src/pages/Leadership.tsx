import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Linkedin } from "lucide-react";

const leaders = [
  {
    name: "Sarah Greenberg",
    email: "sarahg89@uw.edu",
    linkedin: "https://www.linkedin.com/in/sarah-greenberg1/",
    photo: "sarah-greenberg.jpeg",
    role: "President",
    description:
      "Facilitates executive team and general club meetings and ensures overall operations run smoothly. Also manages the LinkedIn account."
  },
  {
    name: "Kaspar Marwick",
    email: "kmarwick@uw.edu",
    linkedin: "https://www.linkedin.com/in/kaspar-marwick-97b0a418a/",
    photo: "kaspar-marwick.jpeg",
    role: "Vice-President",
    description:
      "Supports the president and ensures SAO compliance."
  },
  {
    name: "Marcus Clement",
    email: "marcus20@uw.edu",
    linkedin: "https://www.linkedin.com/in/marcus-clement27/",
    photo: "marcus-clement.jpeg",
    role: "Director of Technology & AI",
    description:
      "Leading club events, planning, and logistics tied to technology and AI. Teaching AI principles and development practices."
  },
  {
    name: "Raya Rehmat",
    email: "rayar@uw.edu",
    linkedin: "https://www.linkedin.com/in/raya-r-rehmat/",
    photo: "raya-rehmat.jpeg",
    role: "Director of Marketing",
    description:
      "Manages digital experiences and designs social media content."
  },
  {
    name: "Alarick Alfredo-Sorto",
    email: "alarick@uw.edu",
    linkedin: "https://www.linkedin.com/in/alarick-alfredo-sorto/",
    photo: "alarick-alfredo-sorto.jpeg",
    role: "Director of Operations",
    description:
      "Manages administrative logistics and supports all executive roles. Also books study rooms and classrooms for meetings (with Director of Finance)."
  },
  {
    name: "Milana Trigubova",
    email: "milant3@uw.edu",
    linkedin: "https://www.linkedin.com/in/milana-trigubova/",
    photo: "milana-trigubova.jpeg",
    role: "Director of Events",
    description:
      "Leads outreach to panelists and guest speakers and coordinates events."
  },
  {
    name: "Lucia Fernandez-Binder",
    email: "luciafb@uw.edu",
    linkedin: "https://www.linkedin.com/in/lucia-fernandez-binder/",
    photo: "lucia-fernandez-binder.jpeg",
    role: "Director of Strategy & Outreach",
    description:
      "Defines why FosterAI should matter to Foster students, sets growth goals (membership & retention), leads recruitment initiatives, and develops partnerships with other Foster RSOs."
  },
  {
    name: "Diya Shah",
    email: "dshah16@uw.edu",
    linkedin: "https://www.linkedin.com/in/diya-shah16/",
    photo: "diya-shah.jpeg",
    role: "Director of Finance",
    description:
      "Prepares presentation slide outlines, leads workshops and skill-building sessions. Oversees budget and is responsible for securing the $500 stipend per quarter."
  }
];


const Leadership = () => {
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
          {leaders.map((leader) =>
            <div
              key={leader.email}
            className="rounded-xl border border-border bg-card p-6 flex flex-col gap-3 hover:border-primary/40 transition-colors">
            
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
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                {leader.description}
              </p>
              <div className="flex flex-col gap-1.5 pt-2 border-t border-border">
                <a
                  href={`mailto:${leader.email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                  {leader.email}
                </a>
                {leader.linkedin && (
                  <a
                    href={leader.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative mt-1 inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-muted-foreground transition-transform duration-200 hover:scale-110 active:scale-95"
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
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>);

};

export default Leadership;