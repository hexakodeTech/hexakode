import React from "react";

interface JobTechnologiesProps {
  technologies: string[];
  niceToHave: string[];
}

export default function JobTechnologies({ technologies, niceToHave }: JobTechnologiesProps) {
  const hasTech = technologies && technologies.length > 0;
  const hasNice = niceToHave && niceToHave.length > 0;

  if (!hasTech && !hasNice) return null;

  return (
    <div className="mb-8 space-y-6">
      {hasTech && (
        <div>
          <h4 className="font-headline-sm text-[16px] text-white font-bold uppercase tracking-wider mb-3 font-headline">
            Technologies & Tools
          </h4>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="font-label-mono text-[11px] text-secondary-container bg-secondary/10 border border-secondary/20 px-3 py-1 rounded-md"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {hasNice && (
        <div>
          <h4 className="font-headline-sm text-[16px] text-white font-bold uppercase tracking-wider mb-3 font-headline">
            Nice To Have
          </h4>
          <div className="flex flex-wrap gap-2">
            {niceToHave.map((item) => (
              <span
                key={item}
                className="font-label-mono text-[11px] text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-md"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
