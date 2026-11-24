"use client";

import { ArrowUpRight, FolderGit2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { projects } from "@/lib/resume";
import { SectionShell } from "./SectionShell";

export function ProjectsSection() {
  return (
    <SectionShell
      stationIndex={6}
      eyebrow="Selected Projects"
      title="Applied AI platforms & data-driven web ecosystems."
      subtitle="End-to-end builds combining LLM parsing, recommendation pipelines, relational schema architecture, and operational analytics."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {projects.map((project, idx) => (
          <Card
            key={project.title}
            className="glass group flex flex-col justify-between border-white/15 text-white ring-0 transition-all hover:border-brand/55"
          >
            <div>
              <CardHeader className="border-b border-white/15 pb-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-brand">
                    <FolderGit2 className="size-4" />
                    Project 0{idx + 1}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-white/75">
                    {project.period}
                  </span>
                </div>
                <CardTitle className="text-xl font-semibold text-white transition-colors group-hover:text-brand">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-sm text-white/80">
                  {project.subtitle}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-4">
                <ul className="space-y-2.5">
                  {project.description.map((line, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed text-white/92 sm:text-[15px]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 pt-1">
                  {project.tags.map((t) => (
                    <Badge
                      key={t}
                      variant="outline"
                      className="h-auto border-white/20 bg-white/10 px-2.5 py-1 font-mono text-xs font-normal text-white/92"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </div>

            <CardFooter className="mt-4 flex flex-wrap gap-2.5 border-t border-white/15 bg-white/[0.04] px-4 py-3.5">
              {project.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-white transition-colors hover:border-brand hover:bg-brand hover:text-black"
                >
                  {link.label}
                  <ArrowUpRight className="size-3.5" />
                </a>
              ))}
            </CardFooter>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}
