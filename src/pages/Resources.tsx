import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { ExternalLink, Search, MessageCirclePlus, GraduationCap } from "lucide-react";
import { DISCORD_INVITE_URL } from "@/lib/links";
import {
  resourceCategories,
  resourceTools,
  type ResourceCategoryId,
  type ResourceTool,
} from "@/data/resources";

const ToolLogo = ({ tool }: { tool: ResourceTool }) => {
  const [failed, setFailed] = useState(false);
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/95 shadow-sm">
      {failed ? (
        <span className="font-display text-lg font-bold text-slate-800">{tool.name[0]}</span>
      ) : (
        <img
          src={tool.logo}
          alt=""
          loading="lazy"
          className="h-8 w-8 object-contain"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
};

/** Card is a div with a stretched title link, so the student-offer link can sit on top without nesting anchors. */
const ToolCard = ({ tool }: { tool: ResourceTool }) => (
  <div className="group relative flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-indigo-400/40 hover:bg-indigo-500/[0.06]">
    <div className="flex items-start gap-3">
      <ToolLogo tool={tool} />
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-lg font-semibold text-foreground">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${tool.name} (opens in a new tab)`}
            className="no-underline after:absolute after:inset-0 after:content-['']">
            {tool.name}
          </a>
        </h3>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {tool.memberPick && (
            <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
              Member pick
            </span>
          )}
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
            Free tier
          </span>
        </div>
      </div>
      <ExternalLink
        className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-indigo-300"
        aria-hidden
      />
    </div>
    <p className="text-sm leading-relaxed text-muted-foreground">
      {tool.blurb}
      {tool.note && <span className="text-foreground/80"> {tool.note}</span>}
    </p>
    {tool.studentOffer && (
      <a
        href={tool.studentOffer.url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300 no-underline transition-colors hover:bg-emerald-500/20">
        <GraduationCap className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <span>
          Student offer: {tool.studentOffer.label}
          <ExternalLink className="ml-1 inline h-3 w-3 align-[-1px]" aria-hidden />
        </span>
      </a>
    )}
    <ul className="mt-auto flex flex-wrap gap-1.5">
      {tool.useCases.map((u) => (
        <li key={u} className="rounded-full border border-border/70 bg-secondary/30 px-2.5 py-1 text-xs text-foreground/80">
          {u}
        </li>
      ))}
    </ul>
  </div>
);

const Resources = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ResourceCategoryId | "all">("all");

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    return resourceCategories
      .filter((c) => category === "all" || c.id === category)
      .map((c) => ({
        category: c,
        tools: resourceTools.filter(
          (t) =>
            t.category === c.id &&
            (!q || [t.name, t.blurb, ...t.useCases].some((s) => s.toLowerCase().includes(q))),
        ),
      }))
      .filter((s) => s.tools.length > 0);
  }, [query, category]);

  const chipClass = (active: boolean) =>
    `shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold tracking-tight transition-colors ${
      active
        ? "border-indigo-400/30 bg-indigo-500/20 text-foreground"
        : "border-border/50 bg-secondary/30 text-muted-foreground hover:bg-indigo-500/15 hover:text-foreground"
    }`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-10 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            AI <span className="text-indigo-300">Resources</span>
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground leading-relaxed">
            The AI platforms our members actually reach for, sorted by what you're trying to get done. Start with the
            category you need.
          </p>
        </div>
      </section>

      <section className="px-6 pb-8">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="relative mx-auto max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools, e.g. interview, resume, code"
              aria-label="Search tools"
              className="h-12 rounded-full bg-card pl-11"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:justify-center md:overflow-visible">
            <button type="button" onClick={() => setCategory("all")} className={chipClass(category === "all")}>
              All
            </button>
            {resourceCategories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={chipClass(category === c.id)}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto space-y-12">
          {sections.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">
              No tools match "{query}". Try a different search, or tell us what's missing below.
            </p>
          )}
          {sections.map(({ category: c, tools }) => (
            <div key={c.id}>
              <h2 className="mb-5 flex items-center gap-2.5 font-display text-2xl font-bold text-foreground">
                <c.icon className="h-5 w-5 text-indigo-300" aria-hidden />
                {c.label}
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((t) => (
                  <ToolCard key={t.name} tool={t} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl rounded-2xl border border-indigo-400/30 bg-indigo-500/[0.08] p-8 md:p-10 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Know a tool we're missing?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground leading-relaxed">
            Post it in the NetworkAI group chat with a line on what you use it for, and we'll add it here. We only list
            tools with a free tier.
          </p>
          <a
            href={DISCORD_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-400">
            <MessageCirclePlus className="h-4 w-4" aria-hidden />
            Add to the list
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Resources;
