import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sajib Saha — Software Engineer · Agentic AI & LLM Systems",
  description:
    "Portfolio of Sajib Saha, Software Engineer at Therap (BD). Production healthcare software in Java 21 & Oracle DB, LLM-powered agents on Gemma 4, and coding-agent evaluation on SWE-Bench Pro and Terminal-Bench 2.0.",
  keywords: [
    "Sajib Saha",
    "Software Engineer",
    "Agentic AI",
    "LLM",
    "Claude Code",
    "SWE-Bench Pro",
    "Terminal-Bench",
    "Java",
    "Next.js",
    "Dhaka",
  ],
  authors: [{ name: "Sajib Saha", url: "https://github.com/Sajibsahacsedu" }],
  openGraph: {
    title: "Sajib Saha — Software Engineer · Agentic AI & LLM Systems",
    description:
      "Production healthcare software, LLM-powered agents, and coding-agent evaluation. Explore the portfolio.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} dark antialiased`}>
      <body className="min-h-svh bg-black">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
