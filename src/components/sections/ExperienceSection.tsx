"use client";

import { ArrowUpRight, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { experience } from "@/lib/resume";
import { SectionShell } from "./SectionShell";

export function ExperienceSection() {
  return (
    <SectionShell
      stationIndex={2}
      eyebrow="Work Experience"
      title="Production healthcare platforms & AI-native backends."
      subtitle="Shipping safety-critical clinical modules, open-weight LLM data agents, and full-stack e-commerce services."
    >
      <div className="space-y-6">
        {experience.map((job) => (
          <Card
            key={job.company}
            className="glass border-white/15 text-white ring-0 transition-colors hover:border-brand/50"
          >
            <CardHeader className="border-b border-white/15 pb-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-xl font-semibold text-white sm:text-2xl">
                    {job.company}
                  </CardTitle>
                  <CardDescription className="mt-1 text-base font-medium text-brand">
                    {job.role}
                  </CardDescription>
                </div>

                <div className="flex flex-col items-start gap-1.5 text-left sm:items-end sm:text-right">
                  <span className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-white/90">
                    {job.period}
                  </span>
                  <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-white/75">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5 text-brand/80" />
                      {job.location}
                    </span>
                    <a
                      href={job.link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-0.5 font-medium text-brand transition-colors hover:text-white"
                    >
                      {job.link.label}
                      <ArrowUpRight className="size-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {job.stack.map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="h-auto border-white/20 bg-white/10 px-3 py-1 font-mono text-xs font-normal text-white/95"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardHeader>

            <CardContent className="pt-5">
              {/* Numbered deliverables list matching SLX /services aesthetic */}
              <ol className="divide-y divide-white/12">
                {job.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                    <span className="mt-0.5 shrink-0 font-mono text-xs font-semibold text-brand tabular-nums sm:text-sm">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm leading-relaxed text-white/92 sm:text-base">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}
