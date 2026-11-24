"use client";

import { Bot, Database, FlaskConical, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { profile, stats } from "@/lib/resume";
import { SectionShell } from "./SectionShell";

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Production Healthcare Systems",
    detail: "Java 21 & Oracle DB powering ISP, MAR, and clinical health-tracking workflows where correctness matters.",
  },
  {
    icon: Bot,
    title: "Agent-First Engineering",
    detail: "Daily multi-agent orchestration across Claude Code, Codex & Antigravity, custom Skills, and MCP servers.",
  },
  {
    icon: FlaskConical,
    title: "Coding-Agent Evaluation",
    detail: "Dockerized benchmarking on SWE-Bench Pro & Terminal-Bench 2.0, failure taxonomy, and oracle task authoring.",
  },
  {
    icon: Database,
    title: "AI Training Data & Vision",
    detail: "Polygon/bbox curation in Roboflow, label QA, daily RLHF-grade code review, and arXiv deep-learning research.",
  },
];

export function AboutSection() {
  return (
    <SectionShell
      stationIndex={1}
      eyebrow="Summary"
      title="Bridging production software engineering with agentic AI."
    >
      <Card className="glass border-white/15 text-white ring-0">
        <CardContent className="p-6 sm:p-7">
          <p className="text-base leading-relaxed text-white/95 sm:text-lg sm:leading-8">
            {profile.summary}
          </p>
        </CardContent>
      </Card>

      {/* Metrics row */}
      <div className="mt-5 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="glass flex flex-col justify-between rounded-xl p-4 transition-colors hover:border-brand/55 sm:p-5"
          >
            <span className="font-mono text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
              {s.value}
            </span>
            <span className="mt-2.5 text-xs leading-snug text-white/85 sm:text-[13px]">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Four pillars */}
      <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
        {PILLARS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="glass group rounded-xl p-5 transition-colors hover:border-brand/50"
            >
              <div className="mb-2.5 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand/45 bg-brand/15 text-brand">
                  <Icon className="size-4" />
                </span>
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-white/85">{item.detail}</p>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
