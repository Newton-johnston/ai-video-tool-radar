"use client";

import { useI18n } from "@/context/I18nContext";
import {
  FilterState,
  CATEGORIES,
  FREE_ACCESS_TYPES,
  WATERMARK_OPTIONS,
  AUDIO_OPTIONS,
  SortField,
} from "@/types/tool";

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const { t } = useI18n();

  const update = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: "",
      category: "",
      watermark: "",
      audio_support: "",
      free_access_type: "",
      sort_by: "quality_score",
      sort_order: "desc",
    });
  };

  const hasFilters =
    filters.search ||
    filters.category ||
    filters.watermark ||
    filters.audio_support ||
    filters.free_access_type;

  const selectClass =
    "bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-sm text-dark-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500";

  return (
    <div className="space-y-4">
      <div className="relative">
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
        <input
          type="text"
          placeholder={t("discover.search")}
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={filters.category}
          onChange={(e) => update("category", e.target.value)}
          className={selectClass}
        >
          <option value="">{t("discover.category")}</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={filters.watermark}
          onChange={(e) => update("watermark", e.target.value)}
          className={selectClass}
        >
          <option value="">{t("discover.watermark")}</option>
          {WATERMARK_OPTIONS.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>

        <select
          value={filters.audio_support}
          onChange={(e) => update("audio_support", e.target.value)}
          className={selectClass}
        >
          <option value="">{t("discover.audioSupport")}</option>
          {AUDIO_OPTIONS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <select
          value={filters.free_access_type}
          onChange={(e) => update("free_access_type", e.target.value)}
          className={selectClass}
        >
          <option value="">{t("discover.freeAccess")}</option>
          {FREE_ACCESS_TYPES.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <span className="text-xs text-dark-500">{t("discover.sortBy")}:</span>
          <select
            value={filters.sort_by}
            onChange={(e) => update("sort_by", e.target.value as SortField)}
            className={selectClass}
          >
            <option value="quality_score">{t("discover.quality")}</option>
            <option value="speed_score">{t("discover.speed")}</option>
            <option value="ease_score">{t("discover.ease")}</option>
            <option value="max_duration">{t("discover.maxDuration")}</option>
          </select>
          <button
            onClick={() =>
              update(
                "sort_order",
                filters.sort_order === "desc" ? "asc" : "desc"
              )
            }
            className="px-2 py-2 rounded-lg border border-dark-700 text-dark-400 hover:text-white hover:border-dark-600 transition-colors"
            title={filters.sort_order === "desc" ? "Ascending" : "Descending"}
          >
            {filters.sort_order === "desc" ? "↓" : "↑"}
          </button>
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 rounded-lg text-xs font-medium text-dark-400 hover:text-red-400 border border-dark-700 hover:border-red-500/40 transition-colors"
          >
            {t("discover.clearFilters")}
          </button>
        )}
      </div>
    </div>
  );
}
