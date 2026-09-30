"use client";

import React from "react";

interface CourseCurriculumSectionProps {
  eligibility: string;
  skillIndiaSector: string;
  skillIndiaQpCode: string;
  description: string;
  syllabusInput: string;
  onEligibilityChange: (val: string) => void;
  onSkillIndiaSectorChange: (val: string) => void;
  onSkillIndiaQpCodeChange: (val: string) => void;
  onDescriptionChange: (val: string) => void;
  onSyllabusInputChange: (val: string) => void;
  errors?: Record<string, string>;
}

export default function CourseCurriculumSection({
  eligibility,
  skillIndiaSector,
  skillIndiaQpCode,
  description,
  syllabusInput,
  onEligibilityChange,
  onSkillIndiaSectorChange,
  onSkillIndiaQpCodeChange,
  onDescriptionChange,
  onSyllabusInputChange,
  errors = {},
}: CourseCurriculumSectionProps) {
  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold text-xs">
          2
        </span>
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Curriculum, Syllabus & Skill India Alignment
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Eligibility guidelines, National Skill Development council alignment, and syllabus modules.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Eligibility */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Eligibility Criteria <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={eligibility}
            onChange={(e) => onEligibilityChange(e.target.value)}
            placeholder="e.g. 12th Pass or Any Graduate"
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"
          />
        </div>

        {/* Skill India Sector & QP Code */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Skill India QP / NOS Code
          </label>
          <input
            type="text"
            value={skillIndiaQpCode}
            onChange={(e) => onSkillIndiaQpCodeChange(e.target.value)}
            placeholder="e.g. SSC/Q0501"
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Course Overview & Description
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Brief description of the course, target job roles, and software stack taught..."
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"
        />
      </div>

      {/* Syllabus */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Syllabus Modules (One topic per line)
        </label>
        <textarea
          rows={4}
          value={syllabusInput}
          onChange={(e) => onSyllabusInputChange(e.target.value)}
          placeholder={"HTML5, Modern CSS & Tailwind CSS\nJavaScript ES6+ & TypeScript Foundations\nNext.js App Router & State Management\nNode.js Express & PostgreSQL\nGit & Deployment CI/CD"}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2 text-xs font-mono text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none"
        />
      </div>
    </div>
  );
}
