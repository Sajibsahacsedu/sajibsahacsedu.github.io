"use client";

import { AlertTriangle, ArrowUpRight, CheckCircle2, Container, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { evaluation } from "@/lib/resume";
import { SectionShell } from "./SectionShell";

export function EvaluationSection() {
  return (
    <SectionShell
      stationIndex={3}
      eyebrow="Agentic Coding Evaluation"
      title="Benchmarking coding agents on SWE-Bench Pro & Terminal-Bench 2.0."
      subtitle="Empirical resolve-rate testing, 45-trajectory failure classification, custom Docker task authoring, and cross-harness agent comparison."
    >
      <Card className="glass border-white/15 text-white ring-0">
        <CardHeader className="border-b border-white/15 pb-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg font-semibold text-white sm:text-xl">
                {evaluation.title}
              </CardTitle>
              <CardDescription className="mt-1.5 font-mono text-xs uppercase tracking-[0.18em] text-white/75">
                {evaluation.kind} · {evaluation.period}
              </CardDescription>
            </div>
            <a
              href={evaluation.link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-brand/50 bg-brand/15 px-3.5 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-brand transition-colors hover:bg-brand hover:text-black"
            >
              {evaluation.link.label}
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </CardHeader>

        <CardContent className="pt-5">
          <Tabs defaultValue="benchmarks" className="w-full">
            <TabsList className="mb-5 flex h-auto w-full flex-wrap justify-start gap-1.5 rounded-xl border border-white/15 bg-white/8 p-1.5">
              <TabsTrigger
                value="benchmarks"
                className="cursor-pointer rounded-lg px-3.5 py-2 font-mono text-xs font-medium uppercase tracking-[0.16em] text-white/80 data-active:bg-brand data-active:text-black dark:data-active:border-brand dark:data-active:bg-brand dark:data-active:text-black"
              >
                Resolve Rates
              </TabsTrigger>
              <TabsTrigger
                value="taxonomy"
                className="cursor-pointer rounded-lg px-3.5 py-2 font-mono text-xs font-medium uppercase tracking-[0.16em] text-white/80 data-active:bg-brand data-active:text-black dark:data-active:border-brand dark:data-active:bg-brand dark:data-active:text-black"
              >
                Failure Taxonomy (45)
              </TabsTrigger>
              <TabsTrigger
                value="harness"
                className="cursor-pointer rounded-lg px-3.5 py-2 font-mono text-xs font-medium uppercase tracking-[0.16em] text-white/80 data-active:bg-brand data-active:text-black dark:data-active:border-brand dark:data-active:bg-brand dark:data-active:text-black"
              >
                Tasks &amp; Codex Compare
              </TabsTrigger>
            </TabsList>

            <TabsContent value="benchmarks" className="space-y-4">
              {evaluation.benchmarks.map((bench) => {
                const delta = bench.results[1].value - bench.results[0].value;
                return (
                  <div
                    key={bench.name}
                    className="rounded-xl border border-white/15 bg-white/[0.06] p-5"
                  >
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="flex items-center gap-2 text-base font-semibold text-white sm:text-lg">
                          <Terminal className="size-4 text-brand" />
                          {bench.name}
                        </h3>
                        <p className="mt-1 font-mono text-xs tracking-[0.04em] text-white/75">
                          {bench.detail}
                        </p>
                      </div>
                      <Badge className="h-auto border border-brand/55 bg-brand/20 px-3 py-1 font-mono text-xs font-semibold text-brand">
                        +{delta}pp gain
                      </Badge>
                    </div>

                    <div className="space-y-3.5">
                      {bench.results.map((r, i) => (
                        <div key={r.model} className="space-y-2">
                          <div className="flex items-center justify-between text-sm sm:text-base">
                            <span className={i === 1 ? "font-semibold text-white" : "text-white/80"}>
                              {r.model}
                            </span>
                            <span
                              className={
                                i === 1
                                  ? "font-mono text-base font-semibold text-brand tabular-nums"
                                  : "font-mono text-sm text-white/80 tabular-nums"
                              }
                            >
                              {r.value}%
                            </span>
                          </div>
                          <Progress
                            value={r.value}
                            aria-label={`${bench.name} ${r.model}: ${r.value}%`}
                            className={
                              i === 1
                                ? "[&_[data-slot=progress-indicator]]:bg-gradient-to-r [&_[data-slot=progress-indicator]]:from-brand [&_[data-slot=progress-indicator]]:to-brand-violet [&_[data-slot=progress-track]]:h-2.5 [&_[data-slot=progress-track]]:bg-white/15"
                                : "[&_[data-slot=progress-indicator]]:bg-white/60 [&_[data-slot=progress-track]]:h-2.5 [&_[data-slot=progress-track]]:bg-white/15"
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </TabsContent>

            <TabsContent value="taxonomy" className="space-y-4">
              <div className="rounded-xl border border-white/15 bg-white/[0.06] p-5">
                <div className="mb-3.5 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                  <AlertTriangle className="size-4" />
                  45 Failed Trajectories Classified
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {evaluation.failureModes.map((mode, idx) => (
                    <div
                      key={mode}
                      className="flex items-center gap-3.5 rounded-lg border border-white/15 bg-black/55 px-4 py-3.5"
                    >
                      <span className="font-mono text-xs font-semibold text-brand">
                        0{idx + 1}
                      </span>
                      <span className="text-sm font-medium text-white/95">{mode}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-white/85">
                  Each failed run was audited across tool logs, diffs, and test transcripts to document recurring agentic failure signatures.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="harness" className="space-y-3">
              <div className="rounded-xl border border-white/15 bg-white/[0.06] p-5">
                <div className="mb-3.5 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                  <Container className="size-4" />
                  Benchmark Engineering &amp; Cross-Harness Comparison
                </div>
                <ul className="space-y-3.5">
                  {evaluation.bullets.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm leading-relaxed text-white/92 sm:text-base">
                      <CheckCircle2 className="mt-1 size-4 shrink-0 text-brand" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          </Tabs>

          {/* Compact summary footer always visible regardless of tab */}
          <div className="mt-5 grid grid-cols-3 gap-2.5 border-t border-white/15 pt-4 text-center">
            <div className="rounded-lg bg-white/[0.06] px-2.5 py-3">
              <div className="font-mono text-xl font-semibold text-white">45</div>
              <div className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/75">
                Trajectories
              </div>
            </div>
            <div className="rounded-lg bg-white/[0.06] px-2.5 py-3">
              <div className="font-mono text-xl font-semibold text-brand">3</div>
              <div className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/75">
                Docker Tasks
              </div>
            </div>
            <div className="rounded-lg bg-white/[0.06] px-2.5 py-3">
              <div className="font-mono text-xl font-semibold text-white">2</div>
              <div className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/75">
                Harnesses
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </SectionShell>
  );
}
