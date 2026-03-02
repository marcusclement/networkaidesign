import Navbar from "@/components/Navbar";
import { Mail, Phone } from "lucide-react";

const leaders = [
  {
    name: "Sarah Greenberg",
    email: "sarahg89@uw.edu",
    phone: "206-890-2979",
    role: "President",
    description:
      "Facilitates executive team and general club meetings and ensures overall operations run smoothly. Also manages the LinkedIn account.",
  },
  {
    name: "Kaspar Marwick",
    email: "kmarwick@uw.edu",
    phone: "206-591-8845",
    role: "Vice-President",
    description:
      "Supports the president and ensures SAO compliance.",
  },
  {
    name: "Alarick Alfredo-Sorto",
    email: "alarick@uw.edu",
    phone: "206-678-7237",
    role: "Director of Operations",
    description:
      "Manages administrative logistics and supports all executive roles. Also books study rooms and classrooms for meetings (with Director of Finance).",
  },
  {
    name: "Milana Trigubova",
    email: "milant3@uw.edu",
    phone: "425-534-3821",
    role: "Director of Events",
    description:
      "Leads outreach to panelists and guest speakers and coordinates events.",
  },
  {
    name: "Lucia Fernandez-Binder",
    email: "luciafb@uw.edu",
    phone: "216-421-5003",
    role: "Director of Strategy & Outreach",
    description:
      "Defines why FosterAI should matter to Foster students, sets growth goals (membership & retention), leads recruitment initiatives, and develops partnerships with other Foster RSOs.",
  },
  {
    name: "Diya Shah",
    email: "dshah16@uw.edu",
    phone: "425-504-3493",
    role: "Director of Finance",
    description:
      "Prepares presentation slide outlines, leads workshops and skill-building sessions. Oversees budget and is responsible for securing the $500 stipend per quarter.",
  },
  {
    name: "Raya Rehmat",
    email: "rayar@uw.edu",
    phone: "604-655-9260",
    role: "Director of Marketing",
    description:
      "Manages Instagram (stories/posts) and facilitates group photo shoots.",
  },
  {
    name: "Marcus Clement",
    email: "marcus20@uw.edu",
    phone: "425-757-6331",
    role: "Director of Technology",
    description:
      "Leads workshop plans. Student AI specialist.",
  },
];

const Leadership = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our <span className="text-primary">Leadership</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Meet the executive team driving NetworkAI forward at the University
            of Washington.
          </p>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leaders.map((leader) => (
            <div
              key={leader.email}
              className="rounded-xl border border-border bg-card p-6 flex flex-col gap-3 hover:border-primary/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-display font-bold text-lg">
                {leader.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {leader.name}
                </h3>
                <p className="text-primary text-sm font-medium">{leader.role}</p>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                {leader.description}
              </p>
              <div className="flex flex-col gap-1.5 pt-2 border-t border-border">
                <a
                  href={`mailto:${leader.email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {leader.email}
                </a>
                <a
                  href={`tel:${leader.phone}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {leader.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Leadership;
