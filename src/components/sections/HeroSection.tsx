"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowDownRight, ArrowRight, CornerDownLeft, FileText, MapPin, Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { profile, type StationId } from "@/lib/resume";
import { scrollToId } from "@/lib/scroll-store";
import { cn } from "@/lib/utils";

type QuickAnswer = {
  prompt: string;
  answer: string;
  target: StationId;
  targetLabel: string;
};

const QUICK_PROMPTS: QuickAnswer[] = [
  {
    prompt: "Gemma 4 & Agentic AI",
    answer:
      "At Therap (BD), I build an LLM-powered data agent on Google's open-weight Gemma 4 so users query healthcare records in natural language. Daily, I run multi-agent workflows across Claude Code, Codex, and Antigravity — writing custom Claude Skills and connecting internal MCP servers.",
    target: "experience",
    targetLabel: "View Work Experience",
  },
  {
    prompt: "SWE-Bench Pro & Terminal-Bench results",
    answer:
      "Evaluated Claude Haiku 4.5 vs 5.5 on 20-task samples: resolved 25% → 55% on SWE-Bench Pro and 30% → 65% on Terminal-Bench 2.0 (Harbor). Classified 45 failed trajectories, authored 3 Dockerized Terminal-Bench tasks with oracle solutions, and compared Claude Code against Codex (GPT-5-mini / GPT-6 Luna).",
    target: "evaluation",
    targetLabel: "Inspect Benchmarks",
  },
  {
    prompt: "Healthcare & backend engineering",
    answer:
      "I engineer mission-critical healthcare documentation modules — ISP (Individual Support Plan), MAR (Medication Administration Record), and health-tracking — using Java 21 and Oracle DB at Therap (BD). Previously built FastAPI + Supabase + Prisma + SSLCommerz + VLM Run Orion backends at Fabingo.",
    target: "skills",
    targetLabel: "Explore Tech Stack",
  },
  {
    prompt: "Research & AI training data",
    answer:
      "Published deep-learning research on road damage & manhole detection on arXiv (CNN + Vision Transformer + YOLO) with polygon-annotated Roboflow datasets. Also researching MAPPO multi-agent deep RL for decentralized MEC, and reviewing AI-generated code daily for correctness and RLHF quality.",
    target: "research",
    targetLabel: "Read Research",
  },
];

function resolveQuery(input: string): QuickAnswer {
  const q = input.toLowerCase();
  if (/(swe|bench|terminal|harbor|haiku|codex|eval|fail|traject|gpt)/.test(q)) {
    return QUICK_PROMPTS[1];
  }
  if (/(gemma|agent|claude|mcp|skill|llm|antigravity|orchestr)/.test(q)) {
    return QUICK_PROMPTS[0];
  }
  if (/(research|paper|arxiv|road|manhole|yolo|mappo|rl|annotat|dataset|roboflow|data)/.test(q)) {
    return QUICK_PROMPTS[3];
  }
  if (/(contact|email|phone|hire|reach|dhaka|location|linkedin|github)/.test(q)) {
    return {
      prompt: input,
      answer: `Based in ${profile.location}. Reach me directly at ${profile.email} or ${profile.phone}, or connect via GitHub (${profile.links.github.label}) and LinkedIn.`,
      target: "contact",
      targetLabel: "Jump to Contact",
    };
  }
  if (/(project|skill bridge|zerobin|javafest|hackathon|award|education|university|du)/.test(q)) {
    return {
      prompt: input,
      answer:
        "B.Sc. in CSE from the University of Dhaka (Jan 2022 – May 2026). Built Skill Bridge (OpenAI CV parsing & career roadmap engine) and ZeroBin (Therap JavaFest 2025 2nd Round). Placed 10th out of 100+ teams at IIUC AI Hackathon and Finalist at UAP Hackathon.",
      target: "projects",
      targetLabel: "See Projects & Education",
    };
  }
  return QUICK_PROMPTS[2];
}

export function HeroSection() {
  const [query, setQuery] = useState("");
  const [reply, setReply] = useState<QuickAnswer | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setReply(QUICK_PROMPTS[0]);
      return;
    }
    setReply(resolveQuery(trimmed));
  };

  return (
    <section
      id="home"
      data-station={0}
      aria-label="Introduction"
      className="relative z-10 flex min-h-[100svh] w-full flex-col justify-end px-5 pb-20 pt-28 sm:px-10 sm:pb-24 lg:px-16"
    >
      {/* Soft vignette behind bottom-left hero text for crisp readability on all viewports */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[78%] bg-gradient-to-t from-black/92 via-black/60 to-transparent lg:inset-y-0 lg:right-auto lg:h-full lg:w-[70%] lg:bg-gradient-to-r lg:from-black/88 lg:via-black/58 lg:to-transparent"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        className="relative w-full max-w-2xl lg:max-w-[60%] xl:max-w-[54%]"
      >
        {/* Top live status */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <Badge
            variant="outline"
            className="h-8 gap-2 rounded-full border-brand/50 bg-black/75 px-3.5 font-mono text-xs uppercase tracking-[0.18em] text-brand backdrop-blur-md"
          >
            <span className="h-2 w-2 rounded-full bg-brand" />
            Software Engineer @ Therap (BD)
          </Badge>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm">
            <MapPin className="size-3.5 text-brand" />
            {profile.location}
          </span>
        </div>

        {/* Display headline */}
        <h1 className="text-5xl font-semibold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] sm:text-6xl lg:text-[4.5rem] lg:leading-[1.03]">
          <span className="block">{profile.name}</span>
          <span className="text-gradient mt-2 block text-2xl font-semibold tracking-tight sm:text-4xl lg:text-[2.45rem] lg:leading-[1.16]">
            Agentic AI, LLM Systems &amp; Production Software.
          </span>
        </h1>

        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/92 drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)] sm:text-lg">
          {profile.heroLine}
        </p>

        {/* SLX-inspired Event Horizon interactive prompt bar */}
        <div className="mt-7 max-w-xl">
          <form
            onSubmit={handleSubmit}
            className="glass flex items-center gap-2.5 rounded-xl p-2 pl-4 transition-colors focus-within:border-brand/70"
          >
            <Sparkles className="size-4 shrink-0 text-brand" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about Gemma 4, SWE-Bench Pro, Java 21, or research..."
              aria-label="Ask about Sajib Saha's experience"
              className="w-full bg-transparent py-1.5 text-sm text-white placeholder:text-white/60 focus:outline-none sm:text-base"
            />
            <Button
              type="submit"
              size="sm"
              className="h-9 shrink-0 gap-1.5 rounded-lg bg-white px-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-black hover:bg-brand hover:text-black"
            >
              Ask
              <CornerDownLeft className="size-3.5" />
            </Button>
          </form>

          {/* Suggested prompt chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((item) => {
              const selected = reply?.prompt === item.prompt;
              return (
                <button
                  key={item.prompt}
                  type="button"
                  onClick={() => {
                    setQuery(item.prompt);
                    setReply(item);
                  }}
                  className={cn(
                    "cursor-pointer rounded-full border px-3 py-1.5 font-mono text-xs tracking-[0.04em] backdrop-blur-md transition-colors",
                    selected
                      ? "border-brand bg-brand/20 text-brand"
                      : "border-white/20 bg-black/75 text-white/85 hover:border-brand/60 hover:text-white",
                  )}
                >
                  {item.prompt}
                </button>
              );
            })}
          </div>

          {/* Grounded answer drawer */}
          <AnimatePresence mode="wait">
            {reply && (
              <motion.div
                key={reply.prompt}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="glass mt-3.5 rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm leading-relaxed text-white/95 sm:text-base">{reply.answer}</p>
                  <button
                    type="button"
                    onClick={() => setReply(null)}
                    aria-label="Dismiss answer"
                    className="shrink-0 cursor-pointer rounded p-1 text-white/65 transition-colors hover:bg-white/15 hover:text-white"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <div className="mt-3.5 flex items-center justify-between border-t border-white/15 pt-3">
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-white/65">
                    Grounded in resume data
                  </span>
                  <button
                    type="button"
                    onClick={() => scrollToId(reply.target)}
                    className="inline-flex cursor-pointer items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-brand transition-colors hover:text-white"
                  >
                    {reply.targetLabel}
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Primary CTA buttons */}
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            onClick={() => scrollToId("experience")}
            className="h-11 cursor-pointer gap-2 rounded-full bg-brand px-6 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-black hover:bg-brand/90"
          >
            Explore Experience
            <ArrowDownRight className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => scrollToId("contact")}
            className="h-11 cursor-pointer rounded-full border-white/30 bg-black/70 px-6 font-mono text-xs font-medium uppercase tracking-[0.2em] text-white backdrop-blur-md hover:border-white/60 hover:bg-white/15 hover:text-white"
          >
            Contact
          </Button>
          <Link
            href="/resume"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "h-11 gap-2 rounded-full border border-white/15 bg-black/55 px-5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm hover:border-brand/50 hover:bg-white/10 hover:text-white",
            )}
          >
            <FileText className="size-4 text-brand" />
            ATS Resume
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
