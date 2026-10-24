import { Briefcase, Code2, BookOpen, PenLine, Palette, CalendarCheck, type LucideIcon } from "lucide-react";

export type ResourceCategoryId =
  | "careers"
  | "coding"
  | "research"
  | "writing"
  | "design"
  | "productivity";

export type ResourceCategory = {
  id: ResourceCategoryId;
  label: string;
  icon: LucideIcon;
};

export type ResourceTool = {
  name: string;
  url: string;
  category: ResourceCategoryId;
  blurb: string;
  useCases: string[];
  /** Path under /public. Missing files fall back to an initial tile. */
  logo: string;
  memberPick?: boolean;
  /** Extra pricing note shown under the blurb (verify before changing). */
  note?: string;
  /** Student discount: label shown on the offer link, and where it goes. */
  studentOffer?: { label: string; url: string };
};

export const resourceCategories: ResourceCategory[] = [
  { id: "careers", label: "Job search and careers", icon: Briefcase },
  { id: "coding", label: "Coding and building", icon: Code2 },
  { id: "research", label: "Research and learning", icon: BookOpen },
  { id: "writing", label: "Writing and communication", icon: PenLine },
  { id: "design", label: "Design and creative", icon: Palette },
  { id: "productivity", label: "Productivity and meetings", icon: CalendarCheck },
];

const logo = (slug: string) => `/resources/logos/${slug}.png`;

/** Every tool listed here has a free tier. Add a tool by appending one object. */
export const resourceTools: ResourceTool[] = [
  // Job search and careers
  {
    name: "Yoodli",
    url: "https://yoodli.ai/",
    category: "careers",
    memberPick: true,
    logo: logo("yoodli"),
    blurb: "Practice interviews and presentations with an AI coach that scores your delivery.",
    useCases: ["Mock interviews", "Presentation practice", "Cutting filler words"],
  },
  {
    name: "Teal",
    url: "https://www.tealhq.com/",
    category: "careers",
    logo: logo("teal"),
    blurb: "Track applications and tailor your resume to each job posting.",
    useCases: ["Application tracking", "Resume tailoring", "Internship search"],
  },
  {
    name: "Jobscan",
    url: "https://www.jobscan.co/",
    category: "careers",
    logo: logo("jobscan"),
    blurb: "Compare your resume against a job description to improve ATS match.",
    useCases: ["ATS keyword check", "Resume scoring"],
    note: "Jobscan Pro is free for UW students.",
  },
  {
    name: "Final Round AI",
    url: "https://www.finalroundai.com/",
    category: "careers",
    logo: logo("final-round-ai"),
    blurb: "Mock interviews and live interview support.",
    useCases: ["Behavioral interview prep", "Technical interview prep"],
  },
  {
    name: "Simplify",
    url: "https://simplify.jobs/",
    category: "careers",
    logo: logo("simplify"),
    blurb: "Autofill job applications, track them automatically, and tailor your resume with a browser extension.",
    useCases: ["Internship applications", "Autofill", "Application tracking"],
  },
  {
    name: "Huntr",
    url: "https://huntr.co/",
    category: "careers",
    logo: logo("huntr"),
    blurb: "Job tracker and resume builder in one, with tailored resumes for each application.",
    useCases: ["Job tracking", "Tailored resumes", "Networking contacts"],
  },
  {
    name: "Kickresume",
    url: "https://www.kickresume.com/",
    category: "careers",
    logo: logo("kickresume"),
    blurb: "Build a resume and cover letter from templates with AI writing help.",
    useCases: ["First resume", "Cover letters", "Resume templates"],
    note: "Free plan has a limited set of templates.",
  },

  // Coding and building
  {
    name: "Cursor",
    url: "https://cursor.com/",
    category: "coding",
    memberPick: true,
    logo: logo("cursor"),
    blurb: "A code editor with AI built in. Describe a change and it edits your project.",
    useCases: ["Class projects", "Learning a new codebase", "Debugging"],
  },
  {
    name: "GitHub Copilot",
    url: "https://github.com/features/copilot",
    category: "coding",
    logo: logo("github-copilot"),
    blurb: "Code suggestions and chat inside the editor you already use.",
    useCases: ["Autocomplete", "Explaining unfamiliar code", "Writing tests"],
  },
  {
    name: "Replit",
    url: "https://replit.com/",
    category: "coding",
    logo: logo("replit"),
    blurb: "Build and host apps from your browser, with an AI agent to help.",
    useCases: ["Quick prototypes", "Hackathons", "No-setup coding"],
  },
  {
    name: "Lovable",
    url: "https://lovable.dev/",
    category: "coding",
    logo: logo("lovable"),
    blurb: "Turn a plain-English description into a working web app.",
    useCases: ["Idea validation", "Portfolio sites", "Side projects"],
  },
  {
    name: "v0",
    url: "https://v0.app/",
    category: "coding",
    logo: logo("v0"),
    blurb: "Describe a page or component and get working React and Tailwind code you can tweak and deploy.",
    useCases: ["UI prototypes", "Landing pages", "Learning front-end"],
  },
  {
    name: "Windsurf",
    url: "https://windsurf.com/",
    category: "coding",
    logo: logo("windsurf"),
    blurb: "An AI code editor with an agent that can plan and make changes across your project.",
    useCases: ["Class projects", "Refactoring", "Learning a codebase"],
  },
  {
    name: "Bolt",
    url: "https://bolt.new/",
    category: "coding",
    logo: logo("bolt"),
    blurb: "Describe an app in plain English and build, run, and deploy it from your browser.",
    useCases: ["Hackathon prototypes", "Side projects", "Quick demos"],
  },
  {
    name: "Hugging Face",
    url: "https://huggingface.co/",
    category: "coding",
    logo: logo("hugging-face"),
    blurb: "The hub for open-source AI models, datasets, and demos you can try in the browser.",
    useCases: ["ML coursework", "Trying open models", "Finding datasets"],
  },
  {
    name: "Google AI Studio",
    url: "https://aistudio.google.com/",
    category: "coding",
    logo: logo("google-ai-studio"),
    blurb: "Experiment with Gemini models and prompts, then grab an API key to build with them.",
    useCases: ["Prompt testing", "Building AI apps", "Learning the Gemini API"],
  },

  // Research and learning
  {
    name: "NotebookLM",
    url: "https://notebooklm.google.com/",
    category: "research",
    logo: logo("notebooklm"),
    blurb: "Upload your documents and ask questions or generate summaries from them.",
    useCases: ["Studying lecture notes", "Summarizing readings", "Exam review"],
  },
  {
    name: "Elicit",
    url: "https://elicit.com/",
    category: "research",
    logo: logo("elicit"),
    blurb: "Find and summarize academic papers.",
    useCases: ["Literature reviews", "Finding sources", "Undergrad research"],
  },
  {
    name: "Perplexity",
    url: "https://www.perplexity.ai/",
    category: "research",
    logo: logo("perplexity"),
    blurb: "An AI search engine that answers questions with cited sources you can click through.",
    useCases: ["Quick research", "Finding sources", "Fact-checking"],
  },
  {
    name: "Consensus",
    url: "https://consensus.app/",
    category: "research",
    logo: logo("consensus"),
    blurb: "Search peer-reviewed papers and get answers grounded in the research.",
    useCases: ["Evidence for papers", "Literature reviews", "Health and science questions"],
  },
  {
    name: "Semantic Scholar",
    url: "https://www.semanticscholar.org/",
    category: "research",
    logo: logo("semantic-scholar"),
    blurb: "A free academic search engine with AI-generated paper summaries.",
    useCases: ["Finding papers", "Quick paper summaries", "Tracking citations"],
  },
  {
    name: "ResearchRabbit",
    url: "https://www.researchrabbit.ai/",
    category: "research",
    logo: logo("researchrabbit"),
    blurb: "Map out related papers from a few starting points to build your reading list fast.",
    useCases: ["Literature reviews", "Thesis research", "Discovering related work"],
  },
  {
    name: "Quizlet",
    url: "https://quizlet.com/",
    category: "research",
    logo: logo("quizlet"),
    blurb: "Flashcards, practice questions, and study modes, with AI to generate study sets from your notes.",
    useCases: ["Exam prep", "Vocab and definitions", "Flashcards from notes"],
    note: "Some AI study features are limited on the free plan.",
  },
  {
    name: "Julius",
    url: "https://julius.ai/",
    category: "research",
    logo: logo("julius"),
    blurb: "Upload a spreadsheet and ask questions in plain English to get analysis and charts.",
    useCases: ["Data analysis", "Class lab reports", "Charts without code"],
  },

  // Writing and communication
  {
    name: "Claude",
    url: "https://claude.ai/",
    category: "writing",
    logo: logo("claude"),
    blurb: "Drafting, editing, analysis, and thinking through problems.",
    useCases: ["Essay feedback", "Explaining hard concepts", "Cover letters"],
  },
  {
    name: "Gemini",
    url: "https://gemini.google.com/",
    category: "writing",
    logo: logo("gemini"),
    blurb: "Google's AI assistant for writing, research, and working across Docs, Gmail, and Drive.",
    useCases: ["Studying with Google Docs", "Summarizing long readings", "Brainstorming"],
    studentOffer: {
      label: "Free Google AI Pro for 1 year (US students, redeem by Dec 31, 2026)",
      url: "https://gemini.google/students/",
    },
  },
  {
    name: "ChatGPT",
    url: "https://chatgpt.com/",
    category: "writing",
    logo: logo("chatgpt"),
    blurb: "General-purpose assistant for writing, brainstorming, and Q&A.",
    useCases: ["Brainstorming", "Study questions", "Drafting emails"],
  },
  {
    name: "Grammarly",
    url: "https://www.grammarly.com/",
    category: "writing",
    logo: logo("grammarly"),
    blurb: "Fix grammar and tone in emails and documents.",
    useCases: ["Proofreading papers", "Professional emails"],
  },
  {
    name: "Microsoft Copilot",
    url: "https://copilot.microsoft.com/",
    category: "writing",
    logo: logo("microsoft-copilot"),
    blurb: "Microsoft's AI assistant for questions, drafting, and image generation.",
    useCases: ["Drafting", "Brainstorming", "Quick Q&A"],
  },
  {
    name: "QuillBot",
    url: "https://quillbot.com/",
    category: "writing",
    logo: logo("quillbot"),
    blurb: "Paraphrase, summarize, and polish your writing, with a free paraphraser that needs no sign-up.",
    useCases: ["Rewording", "Summarizing readings", "Clearer drafts"],
    note: "Check your professor's AI policy before using it on graded work.",
  },
  {
    name: "DeepL",
    url: "https://www.deepl.com/",
    category: "writing",
    logo: logo("deepl"),
    blurb: "Translation that reads naturally, plus a writing assistant for polishing text.",
    useCases: ["Translating readings", "Language classes", "International communication"],
    note: "Free version has monthly character limits.",
  },

  // Design and creative
  {
    name: "Canva",
    url: "https://www.canva.com/",
    category: "design",
    logo: logo("canva"),
    blurb: "Make slides, graphics, and social posts from templates, with AI tools.",
    useCases: ["Class presentations", "Club posters", "Social posts"],
  },
  {
    name: "Figma",
    url: "https://www.figma.com/",
    category: "design",
    logo: logo("figma"),
    blurb: "Design interfaces and prototypes with AI-assisted features.",
    useCases: ["App mockups", "Wireframes", "Team design work"],
  },
  {
    name: "Gamma",
    url: "https://gamma.app/",
    category: "design",
    logo: logo("gamma"),
    blurb: "Generate slide decks, documents, and web pages from a short prompt.",
    useCases: ["Class presentations", "Pitch decks", "One-pagers"],
  },
  {
    name: "Adobe Firefly",
    url: "https://firefly.adobe.com/",
    category: "design",
    logo: logo("adobe-firefly"),
    blurb: "Generate and edit images, video, and audio from text prompts.",
    useCases: ["Poster art", "Social graphics", "Quick visuals"],
    note: "Free plan has limited monthly generations.",
  },
  {
    name: "Napkin AI",
    url: "https://www.napkin.ai/",
    category: "design",
    logo: logo("napkin"),
    blurb: "Turn text into clean diagrams and infographics.",
    useCases: ["Presentation visuals", "Explaining processes", "Study diagrams"],
    note: "Free plan has limited AI credits.",
  },
  {
    name: "ElevenLabs",
    url: "https://elevenlabs.io/",
    category: "design",
    logo: logo("elevenlabs"),
    blurb: "Realistic AI voices for narration, voiceovers, and audio projects.",
    useCases: ["Video narration", "Audio versions of notes", "Podcast projects"],
    note: "Free plan does not include commercial use.",
  },
  {
    name: "Suno",
    url: "https://suno.com/",
    category: "design",
    logo: logo("suno"),
    blurb: "Make full songs with vocals from a text prompt.",
    useCases: ["Project soundtracks", "Jingles", "Creative experiments"],
    note: "Free plan does not include commercial rights.",
  },

  // Productivity and meetings
  {
    name: "Otter",
    url: "https://otter.ai/",
    category: "productivity",
    logo: logo("otter"),
    blurb: "Live meeting transcripts and summaries.",
    useCases: ["Lecture transcripts", "Club meeting notes"],
  },
  {
    name: "Fireflies",
    url: "https://fireflies.ai/",
    category: "productivity",
    logo: logo("fireflies"),
    blurb: "Records, transcribes, and searches your calls.",
    useCases: ["Group project calls", "Searchable meeting history"],
  },
  {
    name: "Fathom",
    url: "https://fathom.ai/",
    category: "productivity",
    logo: logo("fathom"),
    blurb: "Records, transcribes, and summarizes your video calls.",
    useCases: ["Group project calls", "Interview recaps", "Action items"],
  },
  {
    name: "Zapier",
    url: "https://zapier.com/",
    category: "productivity",
    logo: logo("zapier"),
    blurb: "Connect your apps and automate repetitive tasks, with AI to help build the workflows.",
    useCases: ["Automating busy work", "Club operations", "Syncing forms to sheets"],
    note: "Free plan has limited tasks per month.",
  },
  {
    name: "Wispr Flow",
    url: "https://wisprflow.ai/",
    category: "productivity",
    logo: logo("wispr-flow"),
    blurb: "Dictate anywhere on your computer and get clean, edited text instead of a raw transcript.",
    useCases: ["Faster note-taking", "Drafting emails", "Writing by voice"],
    note: "Free plan has a weekly word limit.",
  },
  {
    name: "Granola",
    url: "https://www.granola.ai/",
    category: "productivity",
    logo: logo("granola"),
    blurb: "An AI notepad that turns your meeting notes into clear summaries, no meeting bot required.",
    useCases: ["Club meetings", "Interviews", "Office hours notes"],
    note: "Free plan has limited meeting history.",
  },
];
