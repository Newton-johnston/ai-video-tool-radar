"use client";

import { useMemo } from "react";
import { useI18n } from "@/context/I18nContext";
import { mockTools } from "@/data/mockTools";
import Link from "next/link";

interface WorkflowCategory {
  key: string;
  titleKey: string;
  descKey: string;
  filter: (tool: (typeof mockTools)[number]) => boolean;
}

const workflowCategories: WorkflowCategory[] = [
  {
    key: "unlimitedGen",
    titleKey: "longVideo.unlimitedGen",
    descKey: "longVideo.unlimitedGenDesc",
    filter: (t) =>
      t.free_access_type === "Free Forever" ||
      (!!t.free_limit && t.free_limit.toLowerCase().includes("unlimited")),
  },
  {
    key: "highQuality",
    titleKey: "longVideo.highQuality",
    descKey: "longVideo.highQualityDesc",
    filter: (t) =>
      (t.quality_score ?? 0) >= 4 &&
      (t.category === "Video Editing" || t.category === "Long Video"),
  },
  {
    key: "imageToVideo",
    titleKey: "longVideo.imageToVideo",
    descKey: "longVideo.imageToVideoDesc",
    filter: (t) => t.category === "Image-to-Video",
  },
  {
    key: "withAudio",
    titleKey: "longVideo.withAudio",
    descKey: "longVideo.withAudioDesc",
    filter: (t) => t.audio_support === "Audio Supported",
  },
  {
    key: "characterConsistency",
    titleKey: "longVideo.characterConsistency",
    descKey: "longVideo.characterConsistencyDesc",
    filter: (t) =>
      t.category === "Character Animation" || t.category === "Avatar & Talking Head",
  },
];

export default function LongVideoPage() {
  const { t } = useI18n();

  const categorizedTools = useMemo(
    () =>
      workflowCategories.map((cat) => ({
        ...cat,
        tools: mockTools.filter(cat.filter).slice(0, 4),
      })),
    []
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-3">
          {t("longVideo.title")}
        </h1>
        <p className="text-dark-400 text-lg">{t("longVideo.subtitle")}</p>
      </div>

      {/* Workflow diagram */}
      <div className="bg-dark-850 border border-dark-800 rounded-2xl p-6 mb-10">
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-sm">
          {workflowCategories.map((cat, i) => (
            <div key={cat.key} className="flex items-center">
              <div className="px-4 py-2 rounded-xl bg-dark-900 border border-dark-700 text-dark-200">
                {t(cat.titleKey)}
              </div>
              {i < workflowCategories.length - 1 && (
                <svg
                  className="w-6 h-6 text-dark-600 mx-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Category sections */}
      <div className="space-y-8">
        {categorizedTools.map((cat) => (
          <section key={cat.key}>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white mb-1">
                {t(cat.titleKey)}
              </h2>
              <p className="text-dark-500 text-sm">{t(cat.descKey)}</p>
            </div>
            {cat.tools.length === 0 ? (
              <p className="text-dark-600 text-sm py-4">
                {t("longVideo.noToolsFound")}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cat.tools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/tool/${tool.id}`}
                    className="block bg-dark-850 border border-dark-800 hover:border-primary-500/40 rounded-xl p-4 transition-all group"
                  >
                    <h3 className="text-white font-semibold group-hover:text-primary-400 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-dark-500 text-xs mt-1">{tool.category}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          tool.free_access_type === "Free Forever"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-blue-500/10 text-blue-400"
                        }`}
                      >
                        {tool.free_access_type}
                      </span>
                      {tool.max_duration && (
                        <span className="text-xs px-2 py-0.5 rounded bg-dark-700 text-dark-400">
                          {tool.max_duration}s
                        </span>
                      )}
                    </div>
                    <span className="inline-block mt-3 text-xs text-primary-400">
                      {t("longVideo.viewTool")} →
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
