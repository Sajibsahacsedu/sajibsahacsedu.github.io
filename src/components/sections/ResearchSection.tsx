"use client";

import { ArrowUpRight, BookOpen, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { annotation, research } from "@/lib/resume";
import { SectionShell } from "./SectionShell";

export function ResearchSection() {
  return (
    <SectionShell
      stationIndex={5}
      eyebrow="Research & AI Training Data"
      title="Published deep learning, multi-agent RL & dataset craftsmanship."
      subtitle="From polygon-labeled road-defect benchmarks on arXiv to decentralized multi-agent reinforcement learning and RLHF-grade code review."
    >
      <div className="space-y-5">
        {research.map((paper, idx) => (
          <Card
            key={paper.title}
            className="glass border-white/15 text-white ring-0 transition-colors hover:border-brand/55"
          >
            <CardHeader className="border-b border-white/15 pb-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-brand">
                    <BookOpen className="size-3.5" />
                    <span>Research 0{idx + 1}</span>
                    <span className="text-white/40">·</span>
                    <span className="text-white/85">{paper.period}</span>
                  </div>
                  <CardTitle className="text-lg font-semibold leading-snug text-white sm:text-xl">
                    {paper.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-white/80">
                    {paper.supervisor}
                  </CardDescription>
                </div>

                <div className="flex flex-wrap gap-2">
                  {paper.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-brand/50 bg-brand/15 px-3.5 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-brand transition-colors hover:bg-brand hover:text-black"
                    >
                      {l.label}
                      <ArrowUpRight className="size-3.5" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {paper.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="h-auto border-white/20 bg-white/10 px-3 py-1 font-mono text-xs font-normal text-white/95"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>

            <CardContent className="pt-4">
              <ul className="space-y-2.5">
                {paper.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-white/92 sm:text-base">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}

        {/* AI Training Data & Annotation card */}
        <Card className="glass border-brand/35 text-white ring-0">
          <CardHeader className="border-b border-white/15 pb-3.5">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-brand sm:text-[13px]">
              <Layers className="size-4" />
              AI Training Data &amp; Annotation
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ol className="divide-y divide-white/12">
              {annotation.map((line, i) => (
                <li key={i} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                  <span className="mt-0.5 shrink-0 font-mono text-xs font-semibold text-brand tabular-nums sm:text-sm">
                    0{i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-white/92 sm:text-base">{line}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </SectionShell>
  );
}
