"use client";

import { Award, GraduationCap, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { achievements, education } from "@/lib/resume";
import { SectionShell } from "./SectionShell";

const COURSEWORK = [
  "Data Structures",
  "Algorithms",
  "Databases",
  "Software Engineering",
  "Machine Learning",
  "Statistics",
];

export function EducationSection() {
  return (
    <SectionShell
      stationIndex={7}
      eyebrow="Education & Achievements"
      title="Computer Science foundations & competitive honors."
    >
      <div className="space-y-4">
        {education.map((edu, idx) => (
          <Card
            key={edu.school}
            className="glass border-white/15 text-white ring-0 transition-colors hover:border-brand/50"
          >
            <CardHeader className="pb-4">
              <div className="flex flex-wrap items-start justify-between gap-2.5">
                <div>
                  <div className="mb-1.5 flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-brand">
                    <GraduationCap className="size-4" />
                    {idx === 0 ? "Undergraduate Degree" : "Higher Secondary"}
                  </div>
                  <CardTitle className="text-lg font-semibold text-white sm:text-xl">
                    {edu.school}
                  </CardTitle>
                  <CardDescription className="mt-1 text-base text-white/90">
                    {edu.degree}
                  </CardDescription>
                </div>

                <div className="flex flex-col items-start gap-1 sm:items-end">
                  <span className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-white/90">
                    {edu.period}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-[0.14em] text-white/75">
                    <MapPin className="size-3.5 text-brand/80" />
                    {edu.location}
                  </span>
                </div>
              </div>
            </CardHeader>

            {idx === 0 && (
              <CardContent className="border-t border-white/15 pt-4">
                <div className="mb-2.5 font-mono text-xs uppercase tracking-[0.2em] text-white/75">
                  Core Coursework
                </div>
                <div className="flex flex-wrap gap-2">
                  {COURSEWORK.map((course) => (
                    <Badge
                      key={course}
                      variant="outline"
                      className="h-auto border-white/20 bg-white/10 px-3 py-1 text-xs font-normal text-white/95 sm:text-[13px]"
                    >
                      {course}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        {/* Achievements grid */}
        <div className="pt-3">
          <div className="mb-3.5 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-brand sm:text-[13px]">
            <Award className="size-4" />
            Achievements &amp; Recognition
          </div>
          <div className="grid gap-3.5 sm:grid-cols-2">
            {achievements.map((item, i) => (
              <div
                key={item.title}
                className="glass rounded-xl p-5 transition-colors hover:border-brand/55"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-base font-semibold text-white">{item.title}</span>
                  <span className="font-mono text-xs font-semibold text-brand">0{i + 1}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/85">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
