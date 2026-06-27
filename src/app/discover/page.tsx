"use client";

import { useState, useMemo } from "react";
import { useI18n } from "@/context/I18nContext";
import { FilterState } from "@/types/tool";
import { useTools } from "@/hooks/useTools";
import FilterBar from "@/components/FilterBar";
import ToolCard from "@/components/ToolCard";

export default function DiscoverPage() {
  const { t } = useI18n();
  const { tools: allTools, loading } = useTools();
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "",
    watermark: "",
    audio_support: "",
    free_access_type: "",
    sort_by: "quality_score",
    sort_order: "desc",
  });

  const filteredTools = useMemo(() => {
    let result = [...allTools];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.primary_use_case.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filters.category) {
      result = result.filter((t) => t.category === filters.category);
    }

    // Watermark filter
    if (filters.watermark) {
      result = result.filter((t) => t.watermark === filters.watermark);
    }

    // Audio filter
    if (filters.audio_support) {
      result = result.filter(
        (t) => t.audio_support === filters.audio_support
      );
    }

    // Free access filter
    if (filters.free_access_type) {
      result = result.filter(
        (t) => t.free_access_type === filters.free_access_type
      );
    }

    // Sort
    result.sort((a, b) => {
      const aVal = a[filters.sort_by] ?? 0;
      const bVal = b[filters.sort_by] ?? 0;
      if (typeof aVal === "number" && typeof bVal === "number") {
        return filters.sort_order === "desc" ? bVal - aVal : aVal - bVal;
      }
      return 0;
    });

    return result;
  }, [filters, allTools]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {t("discover.title")}
        </h1>
        <p className="text-dark-400">
          {t("home.toolCount", { count: filteredTools.length })}
        </p>
      </div>

      <FilterBar filters={filters} onFilterChange={setFilters} />

      <div className="mt-8">
        {filteredTools.length === 0 ? (
          <div className="text-center py-20">
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
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-dark-500 text-lg">{t("discover.noResults")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
