"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { skills } from "@/lib/resume";
import { SectionShell } from "./SectionShell";

const FILTERS: { id: string; label: string; groups: string[] | null }[] = [
  { id: "all", label: "All (9)", groups: null },
  {
    id: "engineering",
    label: "Engineering",
    groups: ["Languages", "Backend & Web", "Databases", "Tools & Testing"],
  },
  {
    id: "agentic",
    label: "Agentic AI & LLMs",
    groups: ["Agentic Coding", "LLMs & Models", "Agent Evaluation"],
  },
  {
    id: "ml",
    label: "ML & Data",
    groups: ["ML & Data Science", "Data Annotation"],
  },
];

export function SkillsSection() {
  const [filter, setFilter] = useState("all");
  const activeFilter = FILTERS.find((f) => f.id === filter) ?? FILTERS[0];
  const visible = activeFilter.groups
    ? skills.filter((s) => activeFilter.groups!.includes(s.group))
    : skills;

  return (
    <SectionShell
      stationIndex={4}
      eyebrow="Technical Skills"
      title="Full-stack engineering meets agentic orchestration & ML."
      subtitle="Tools and systems used daily across production healthcare software, open-weight LLM agents, benchmarks, and computer-vision pipelines."
    >
      <Tabs value={filter} onValueChange={(v) => setFilter(String(v))} className="mb-5">
        <TabsList className="glass flex h-auto w-full flex-wrap justify-start gap-1.5 rounded-xl p-1.5">
          {FILTERS.map((f) => (
            <TabsTrigger
              key={f.id}
              value={f.id}
              className="cursor-pointer rounded-lg px-3.5 py-2 font-mono text-xs font-medium uppercase tracking-[0.16em] text-white/80 data-active:bg-brand data-active:text-black dark:data-active:border-brand dark:data-active:bg-brand dark:data-active:text-black"
            >
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid gap-4 sm:grid-cols-2">
        {visible.map((category, idx) => (
          <div
            key={category.group}
            className="glass group rounded-xl p-5 transition-colors hover:border-brand/55"
          >
            <div className="mb-3.5 flex items-center justify-between border-b border-white/15 pb-2.5">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-white sm:text-[13px]">
                {category.group}
              </h3>
              <span className="font-mono text-xs font-semibold text-brand tabular-nums">
                {String(idx + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.items.map((item) => (
                <Badge
                  key={item}
                  variant="outline"
                  className="h-auto border-white/20 bg-white/10 px-3 py-1 text-xs font-normal text-white/95 transition-colors group-hover:border-white/25 hover:border-brand hover:text-brand sm:text-[13px]"
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
