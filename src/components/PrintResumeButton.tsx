"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintResumeButton() {
  return (
    <Button
      type="button"
      onClick={() => window.print()}
      className="h-9 cursor-pointer gap-2 rounded-full bg-[#163a6e] px-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white hover:bg-[#102c55]"
    >
      <Printer className="size-3.5" />
      Print / Save PDF
    </Button>
  );
}
