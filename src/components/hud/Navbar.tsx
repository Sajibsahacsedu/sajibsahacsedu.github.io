"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Mail, Menu } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/BrandIcons";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { profile, stations, type StationId } from "@/lib/resume";
import { onProgress, scrollToId, useActiveStation } from "@/lib/scroll-store";
import { cn } from "@/lib/utils";

const NAV_LINKS: { id: StationId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "evaluation", label: "Agent Eval" },
  { id: "skills", label: "Skills" },
  { id: "research", label: "Research" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export function Navbar() {
  const activeIndex = useActiveStation();
  const activeId = stations[activeIndex]?.id ?? "home";
  const [scrolled, setScrolled] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    return onProgress((p) => {
      setScrolled(p > 0.015);
    });
  }, []);

  const handleNav = (id: string) => {
    setSheetOpen(false);
    scrollToId(id);
  };

  return (
    <>
      {/* Subtle top readability gradient at scroll 0 */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-30 h-28 bg-gradient-to-b from-black/80 via-black/35 to-transparent"
      />

      {/* Backdrop bar with SLX-style hairline & end ticks once scrolled */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-40 h-16 transition-opacity duration-300 sm:h-[72px]",
          scrolled ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />
        <div className="absolute inset-x-5 bottom-0 flex items-center sm:inset-x-8">
          <span className="h-2 w-px bg-white/60" />
          <span className="h-px flex-1 bg-white/25" />
          <span className="h-2 w-px bg-white/60" />
        </div>
      </div>

      {/* Brand mark (top-left) */}
      <button
        type="button"
        onClick={() => handleNav("home")}
        className={cn(
          "fixed left-5 z-50 flex cursor-pointer items-center gap-3 text-left text-white transition-[top] duration-300 focus-visible:outline-2 focus-visible:outline-brand sm:left-8",
          scrolled ? "top-3 sm:top-3.5" : "top-5 sm:top-6",
        )}
        aria-label="Scroll to top — Sajib Saha"
      >
        <span
          className={cn(
            "relative flex shrink-0 items-center justify-center rounded-full border border-white/30 bg-black/75 backdrop-blur-sm transition-all duration-300",
            scrolled ? "h-10 w-10" : "h-11 w-11 sm:h-12 sm:w-12",
          )}
        >
          <svg viewBox="0 0 64 64" className="h-[76%] w-[76%]" aria-hidden="true">
            <ellipse
              cx="32"
              cy="32"
              rx="24"
              ry="8"
              fill="none"
              stroke="#63d2c6"
              strokeWidth="2.8"
              transform="rotate(-18 32 32)"
            />
            <circle cx="32" cy="32" r="10.5" fill="#000" stroke="#ffffff" strokeWidth="2.6" />
            <circle cx="50" cy="24" r="3" fill="#63d2c6" />
          </svg>
        </span>
        <span className="hidden flex-col gap-0.5 leading-none min-[380px]:flex">
          <span className="text-base font-medium tracking-[0.22em] text-white uppercase sm:text-[18px]">
            {profile.name}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/80">
            {profile.title} · AI Systems
          </span>
        </span>
      </button>

      {/* Desktop navigation (top-right) */}
      <nav
        aria-label="Primary navigation"
        className={cn(
          "fixed right-5 z-50 hidden items-center gap-6 transition-[top,height] duration-300 sm:right-8 lg:flex xl:gap-7",
          scrolled ? "top-3.5 h-10 sm:top-4" : "top-5 h-12 sm:top-6",
        )}
      >
        {NAV_LINKS.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id)}
              className={cn(
                "relative cursor-pointer font-mono text-xs font-medium uppercase tracking-[0.22em] transition-colors",
                isActive ? "text-white" : "text-white/80 hover:text-white",
              )}
            >
              {item.label}
              <span
                className={cn(
                  "absolute -bottom-2 left-0 h-[2px] w-full bg-brand transition-transform duration-300 origin-left",
                  isActive ? "scale-x-100" : "scale-x-0",
                )}
              />
            </button>
          );
        })}

        <Link
          href="/resume"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "ml-1 h-9 rounded-full border-brand/50 bg-black/70 px-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-white hover:border-brand hover:bg-brand hover:text-black",
          )}
        >
          <FileText className="size-3.5 text-brand" />
          CV
        </Link>
      </nav>

      {/* Mobile / tablet menu drawer using shadcn Sheet */}
      <div
        className={cn(
          "fixed right-4 z-50 flex items-center gap-2 transition-[top] duration-300 lg:hidden",
          scrolled ? "top-3" : "top-5 sm:top-7",
        )}
      >
        <Link
          href="/resume"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-9 rounded-full border-white/20 bg-black/60 px-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white backdrop-blur-md hover:border-brand/60 hover:bg-brand/15",
          )}
        >
          <FileText className="size-3 text-brand" />
          CV
        </Link>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger
            aria-label="Open navigation menu"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition-colors hover:border-brand/60 hover:text-brand"
          >
            <Menu className="size-4" />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[82vw] max-w-xs border-l border-white/10 bg-black/95 text-white backdrop-blur-xl"
          >
            <SheetHeader className="border-b border-white/10 pb-4">
              <SheetTitle className="font-mono text-xs uppercase tracking-[0.3em] text-brand">
                Navigation · 09 Stations
              </SheetTitle>
            </SheetHeader>

            <div className="flex flex-1 flex-col justify-between overflow-y-auto px-4 py-4">
              <ul className="space-y-1">
                {stations.map((s, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => handleNav(s.id)}
                        className={cn(
                          "flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors",
                          isActive
                            ? "bg-brand/15 text-white ring-1 ring-brand/40"
                            : "text-white/65 hover:bg-white/5 hover:text-white",
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <span className={cn("font-mono text-[11px]", isActive ? "text-brand" : "text-white/35")}>
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span className="font-mono text-xs uppercase tracking-[0.22em]">{s.label}</span>
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">
                          {s.body}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
                <Link
                  href="/resume"
                  onClick={() => setSheetOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "w-full rounded-full bg-brand text-black hover:bg-brand/90 font-mono text-xs uppercase tracking-[0.2em]",
                  )}
                >
                  <FileText className="size-3.5" />
                  Printable Resume
                </Link>
                <div className="flex items-center justify-center gap-4 pt-1">
                  <a
                    href={profile.links.github.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/60 transition-colors hover:text-brand"
                    aria-label="GitHub"
                  >
                    <GitHubIcon className="size-4" />
                  </a>
                  <a
                    href={profile.links.linkedin.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/60 transition-colors hover:text-brand"
                    aria-label="LinkedIn"
                  >
                    <LinkedInIcon className="size-4" />
                  </a>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-white/60 transition-colors hover:text-brand"
                    aria-label="Email"
                  >
                    <Mail className="size-4" />
                  </a>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
