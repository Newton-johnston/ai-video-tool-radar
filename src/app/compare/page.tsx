"use client";

import { useState, useMemo } from "react";
import { useI18n } from "@/context/I18nContext";
import { useCompare } from "@/context/CompareContext";
import { mockTools } from "@/data/mockTools";
import ScoreBadge from "@/components/ScoreBadge";

const compareDimensions = [
  { key: "free_access_type", label: "compare.freeAccess" },
  { key: "free_limit", label: "compare.freeLimit" },
  { key: "watermark", label: "compare.watermark" },
  { key: "audio_support", label: "compare.audioSupport" },
  { key: "max_duration", label: "compare.maxDuration" },
  { key: "primary_use_case", label: "compare.outputDirection" },
] as const;

const scoreDimensions = [
  { key: "quality_score", label: "compare.quality", color: "text-green-400" },
  { key: "speed_score", label: "compare.speed", color: "text-blue-400" },
  { key: "ease_score", label: "compare.ease", color: "text-purple-400" },
] as const;

export default function ComparePage() {
  const { t } = useI18n();
  const { compareIds, removeFromCompare, clearCompare, addToCompare } =
    useCompare();
  const [searchQuery, setSearchQuery] = useState("");

  const compareTools = useMemo(
    () => compareIds.map((id) => mockTools.find((t) => t.id === id)).filter(Boolean),
    [compareIds]
  );

  const availableTools = useMemo(
    () =>
      mockTools.filter(
        (t) =>
          !compareIds.includes(t.id) &&
          t.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [compareIds, searchQuery]
  );

  const displayValue = (val: unknown): string => {
    if (val === null || val === undefined || val === "" || val === 0)
      return t("compare.notVerified");
    if (typeof val === "number" && val > 0) return `${val}${t("compare.seconds")}`;
    return String(val);
  };

  if (compareTools.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          {t("compare.title")}
        </h1>
        <p className="text-dark-400 mb-8">{t("compare.subtitle")}</p>
        <div className="bg-dark-850 border border-dark-800 rounded-xl p-12">
          <svg
            className="w-16 h-16 text-dark-700 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
          </svg>
          <p className="text-dark-500 text-lg">{t("compare.empty")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {t("compare.title")}
          </h1>
          <p className="text-dark-400">{t("compare.subtitle")}</p>
        </div>
        <button
          onClick={clearCompare}
          className="px-4 py-2 rounded-lg text-sm font-medium text-dark-400 hover:text-red-400 border border-dark-700 hover:border-red-500/40 transition-colors"
        >
          {t("compare.clearAll")}
        </button>
      </div>

      {/* Add tool search */}
      {compareTools.length < 3 && (
        <div className="mb-6">
          <div className="relative max-w-sm">
            <input
              type="text"
              placeholder={t("compare.selectPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 text-sm"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {searchQuery && (
            <div className="mt-2 flex flex-wrap gap-2">
              {availableTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    addToCompare(tool.id);
                    setSearchQuery("");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-dark-800 border border-dark-700 text-dark-300 text-sm hover:border-primary-500 hover:text-white transition-colors"
                >
                  + {tool.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Compare table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-4 text-dark-500 text-sm font-medium w-40">
                {t("compare.dimension")}
              </th>
              {compareTools.map((tool) => (
                <th key={tool!.id} className="p-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-white font-semibold">
                      {tool!.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-primary-600/10 text-primary-400 text-xs">
                      {tool!.category}
                    </span>
                    <button
                      onClick={() => removeFromCompare(tool!.id)}
                      className="text-xs text-dark-500 hover:text-red-400 transition-colors"
                    >
                      ✕ Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compareDimensions.map((dim) => (
              <tr
                key={dim.key}
                className="border-t border-dark-800"
              >
                <td className="p-4 text-dark-400 text-sm">
                  {t(dim.label)}
                </td>
                {compareTools.map((tool) => (
                  <td key={tool!.id} className="p-4 text-center text-dark-200 text-sm">
                    {displayValue(
                      (tool as unknown as Record<string, unknown>)[dim.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
            {scoreDimensions.map((dim) => (
              <tr
                key={dim.key}
                className="border-t border-dark-800"
              >
                <td className="p-4 text-dark-400 text-sm">
                  {t(dim.label)}
                </td>
                {compareTools.map((tool) => (
                  <td key={tool!.id} className="p-4 text-center">
                    <ScoreBadge
                      score={
                        (tool as unknown as Record<string, unknown>)[dim.key] as number | null
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-dark-800">
              <td className="p-4 text-dark-400 text-sm">
                {t("compare.limitations")}
              </td>
              {compareTools.map((tool) => (
                <td key={tool!.id} className="p-4 text-center text-dark-200 text-sm">
                  {displayValue(tool!.free_limit)}
                </td>
              ))}
            </tr>
            <tr className="border-t border-dark-800">
              <td className="p-4 text-dark-400 text-sm">
                {t("compare.sourceUrl")}
              </td>
              {compareTools.map((tool) => (
                <td key={tool!.id} className="p-4 text-center">
                  <a
                    href={tool!.official_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:text-primary-300 text-sm"
                  >
                    {t("detail.visitOfficial")} ↗
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
