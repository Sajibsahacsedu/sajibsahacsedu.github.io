"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUp, ArrowUpRight, Check, Copy, FileText, Globe, Mail, Phone } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/BrandIcons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { profile } from "@/lib/resume";
import { scrollToId } from "@/lib/scroll-store";
import { cn } from "@/lib/utils";
import { SectionShell } from "./SectionShell";

export function ContactSection() {
  const [copied, setCopied] = useState<"email" | "phone" | null>(null);

  const copy = async (value: string, kind: "email" | "phone") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      // Clipboard may be unavailable on non-HTTPS previews; fallback silently.
    }
  };

  return (
    <SectionShell
      stationIndex={8}
      eyebrow="Contact"
      title="Let's build reliable software & agentic AI."
      subtitle="Open to engineering collaborations, agentic AI systems, coding-agent evaluation, and LLM training-data work."
      centered
      className="pb-28"
    >
      <div className="glass mx-auto max-w-2xl rounded-2xl p-6 text-left sm:p-8">
        <div className="grid gap-3.5 sm:grid-cols-2">
          {/* Email tile */}
          <div className="flex items-center justify-between gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-4 py-4 transition-colors hover:border-brand/60">
            <a href={`mailto:${profile.email}`} className="min-w-0 flex-1">
              <div className="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-brand">
                <Mail className="size-3.5" />
                Email
              </div>
              <div className="mt-1.5 truncate text-base font-medium text-white">
                {profile.email}
              </div>
            </a>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => copy(profile.email, "email")}
              aria-label="Copy email address"
              className="shrink-0 cursor-pointer text-white/80 hover:bg-white/15 hover:text-brand"
            >
              {copied === "email" ? <Check className="size-4 text-brand" /> : <Copy className="size-4" />}
            </Button>
          </div>

          {/* Phone tile */}
          <div className="flex items-center justify-between gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-4 py-4 transition-colors hover:border-brand/60">
            <a href={profile.phoneHref} className="min-w-0 flex-1">
              <div className="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-brand">
                <Phone className="size-3.5" />
                Phone
              </div>
              <div className="mt-1.5 truncate text-base font-medium text-white tabular-nums">
                {profile.phone}
              </div>
            </a>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => copy(profile.phone, "phone")}
              aria-label="Copy phone number"
              className="shrink-0 cursor-pointer text-white/80 hover:bg-white/15 hover:text-brand"
            >
              {copied === "phone" ? <Check className="size-4 text-brand" /> : <Copy className="size-4" />}
            </Button>
          </div>
        </div>

        <Separator className="my-6 bg-white/15" />

        {/* External profiles & printable CV */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-11 gap-2 rounded-full bg-brand px-6 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-black hover:bg-brand/90",
            )}
          >
            <Mail className="size-4" />
            Send Email
          </a>
          <a
            href={profile.links.github.href}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 gap-2 rounded-full border-white/25 bg-white/10 px-5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-white hover:border-brand hover:bg-brand/20 hover:text-white",
            )}
          >
            <GitHubIcon className="size-4" />
            GitHub
            <ArrowUpRight className="size-3.5 text-white/75" />
          </a>
          <a
            href={profile.links.linkedin.href}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 gap-2 rounded-full border-white/25 bg-white/10 px-5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-white hover:border-brand hover:bg-brand/20 hover:text-white",
            )}
          >
            <LinkedInIcon className="size-4" />
            LinkedIn
            <ArrowUpRight className="size-3.5 text-white/75" />
          </a>
          <a
            href={profile.links.website.href}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 gap-2 rounded-full border-white/25 bg-white/10 px-5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-white hover:border-brand hover:bg-brand/20 hover:text-white",
            )}
          >
            <Globe className="size-4" />
            Web
            <ArrowUpRight className="size-3.5 text-white/75" />
          </a>
          <Link
            href="/resume"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 gap-2 rounded-full border-brand/50 bg-brand/15 px-5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand hover:bg-brand hover:text-black",
            )}
          >
            <FileText className="size-4" />
            Printable Resume
          </Link>
        </div>
      </div>

      {/* Minimal footer */}
      <footer className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-6 sm:flex-row">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/75">
          © {profile.name} · {profile.location}
        </span>
        <button
          type="button"
          onClick={() => scrollToId("home")}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm transition-colors hover:border-brand hover:text-brand"
        >
          Return to Gargantua
          <ArrowUp className="size-3.5" />
        </button>
      </footer>
    </SectionShell>
  );
}
