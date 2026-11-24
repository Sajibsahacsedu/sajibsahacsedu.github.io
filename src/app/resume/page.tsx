import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PrintResumeButton } from "@/components/PrintResumeButton";
import {
  achievements,
  annotation,
  education,
  evaluation,
  experience,
  profile,
  projects,
  research,
  skills,
} from "@/lib/resume";

export const metadata: Metadata = {
  title: "Resume — Sajib Saha",
  description: "ATS-friendly printable resume of Sajib Saha — Software Engineer, Agentic AI & LLM Systems.",
};

/**
 * Clean single-column ATS-friendly printable resume matching the LaTeX document.
 */
export default function ResumePage() {
  return (
    <div className="min-h-svh bg-neutral-950 px-4 py-8 text-neutral-900 print:bg-white print:p-0 sm:px-6 sm:py-12">
      {/* Action bar (hidden when printing) */}
      <div className="mx-auto mb-6 flex max-w-[820px] flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/80 transition-colors hover:border-brand/60 hover:text-white"
        >
          <ArrowLeft className="size-3.5 text-brand" />
          Back to 3D Portfolio
        </Link>
        <PrintResumeButton />
      </div>

      {/* Printable A4 sheet */}
      <article className="mx-auto max-w-[820px] rounded-xl bg-white px-6 py-8 shadow-2xl print:max-w-none print:rounded-none print:p-0 print:shadow-none sm:px-12 sm:py-11">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#163a6e] sm:text-4xl">
            {profile.name}
          </h1>
          <p className="mt-1.5 text-sm font-medium text-neutral-800 sm:text-base">
            {profile.title} &nbsp;|&nbsp; {profile.tagline.join("  |  ")}
          </p>
          <p className="mt-1.5 text-xs text-neutral-500">
            {profile.location} &nbsp;•&nbsp;{" "}
            <a href={profile.phoneHref} className="hover:underline">
              {profile.phone}
            </a>{" "}
            &nbsp;•&nbsp;{" "}
            <a href={`mailto:${profile.email}`} className="text-[#163a6e] hover:underline">
              {profile.email}
            </a>
          </p>
          <p className="mt-1 text-xs text-[#163a6e]">
            <a href={profile.links.github.href} target="_blank" rel="noreferrer" className="hover:underline">
              {profile.links.github.label}
            </a>{" "}
            &nbsp;•&nbsp;{" "}
            <a href={profile.links.linkedin.href} target="_blank" rel="noreferrer" className="hover:underline">
              {profile.links.linkedin.label}
            </a>{" "}
            &nbsp;•&nbsp;{" "}
            <a href={profile.links.website.href} target="_blank" rel="noreferrer" className="hover:underline">
              {profile.links.website.label}
            </a>
          </p>
        </header>

        {/* Summary */}
        <ResumeBlock title="Summary">
          <p className="text-[13px] leading-relaxed text-neutral-700">{profile.summary}</p>
        </ResumeBlock>

        {/* Technical Skills */}
        <ResumeBlock title="Technical Skills">
          <dl className="grid grid-cols-1 gap-y-1 text-[13px] sm:grid-cols-[155px_1fr]">
            {skills.map((row) => (
              <div key={row.group} className="contents">
                <dt className="font-semibold text-neutral-900">{row.group}</dt>
                <dd className="text-neutral-700 sm:pb-0.5">{row.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </ResumeBlock>

        {/* Work Experience */}
        <ResumeBlock title="Work Experience">
          <div className="space-y-4">
            {experience.map((job) => (
              <div key={job.company}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-[15px] font-bold text-neutral-900">{job.company}</h3>
                  <span className="text-xs text-neutral-500">{job.period}</span>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
                  <span className="italic text-neutral-700">{job.role}</span>
                  <span className="text-neutral-500">
                    <a href={job.link.href} target="_blank" rel="noreferrer" className="text-[#163a6e] hover:underline">
                      {job.link.label}
                    </a>{" "}
                    • {job.location}
                  </span>
                </div>
                <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[13px] leading-snug text-neutral-700">
                  {job.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ResumeBlock>

        {/* Agentic Coding Evaluation */}
        <ResumeBlock title="Agentic Coding Evaluation">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-[15px] font-bold text-neutral-900">{evaluation.title}</h3>
            <span className="text-xs text-neutral-500">{evaluation.period}</span>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
            <span className="italic text-neutral-700">{evaluation.kind}</span>
            <a href={evaluation.link.href} target="_blank" rel="noreferrer" className="text-[#163a6e] hover:underline">
              {evaluation.link.label}
            </a>
          </div>
          <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[13px] leading-snug text-neutral-700">
            <li>
              Ran Claude Code with Claude Haiku 4.5 and Claude Haiku 5.5 on a 20-task sample of the SWE-Bench Pro
              public set (731 long-horizon tasks in Python, JavaScript, TypeScript, and Go); resolved 25% and 55% of
              tasks, respectively.
            </li>
            <li>
              Evaluated the same two models on a 20-task sample of Terminal-Bench 2.0 (89 human-verified tasks) with
              the Harbor framework; resolved 30% and 65%, respectively.
            </li>
            {evaluation.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </ResumeBlock>

        {/* Research Experience */}
        <ResumeBlock title="Research Experience">
          <div className="space-y-4">
            {research.map((paper) => (
              <div key={paper.title}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-[15px] font-bold text-neutral-900">{paper.title}</h3>
                  <span className="text-xs text-neutral-500">{paper.period}</span>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
                  <span className="italic text-neutral-700">{paper.supervisor}</span>
                  <span className="space-x-2 text-[#163a6e]">
                    {paper.links.map((l) => (
                      <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="hover:underline">
                        {l.label}
                      </a>
                    ))}
                  </span>
                </div>
                <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[13px] leading-snug text-neutral-700">
                  {paper.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ResumeBlock>

        {/* AI Training Data & Annotation */}
        <ResumeBlock title="AI Training Data & Annotation">
          <ul className="list-disc space-y-1 pl-4 text-[13px] leading-snug text-neutral-700">
            {annotation.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </ResumeBlock>

        {/* Projects */}
        <ResumeBlock title="Projects">
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.title}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-[15px] font-bold text-neutral-900">
                    {p.title} — {p.subtitle}
                  </h3>
                  <span className="text-xs text-neutral-500">{p.period}</span>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
                  <span className="italic text-neutral-700">{p.tags.join(", ")}</span>
                  <span className="space-x-2 text-[#163a6e]">
                    {p.links.map((l) => (
                      <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="hover:underline">
                        {l.label}
                      </a>
                    ))}
                  </span>
                </div>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-[13px] leading-snug text-neutral-700">
                  {p.description.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ResumeBlock>

        {/* Education */}
        <ResumeBlock title="Education">
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.school}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-[15px] font-bold text-neutral-900">{edu.school}</h3>
                  <span className="text-xs text-neutral-500">{edu.period}</span>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
                  <span className="italic text-neutral-700">{edu.degree}</span>
                  <span className="text-neutral-500">{edu.location}</span>
                </div>
                {edu.note && <p className="mt-0.5 text-xs italic text-neutral-600">{edu.note}</p>}
              </div>
            ))}
          </div>
        </ResumeBlock>

        {/* Achievements */}
        <ResumeBlock title="Achievements">
          <ul className="list-disc space-y-1 pl-4 text-[13px] leading-snug text-neutral-700">
            {achievements.map((a) => (
              <li key={a.title}>
                <strong className="text-neutral-900">{a.title}</strong>, {a.detail}
              </li>
            ))}
          </ul>
        </ResumeBlock>
      </article>
    </div>
  );
}

function ResumeBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="mb-2 border-b border-[#163a6e] pb-0.5 text-sm font-bold tracking-wider text-[#163a6e] uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}
