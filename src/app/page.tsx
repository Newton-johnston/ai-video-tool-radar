"use client";

import { useState, useMemo } from "react";
import { useI18n } from "@/context/I18nContext";
import { CATEGORIES, FilterState } from "@/types/tool";
import { useTools } from "@/hooks/useTools";
import Link from "next/link";
import ToolCard from "@/components/ToolCard";
import RadarEffect from "@/components/RadarEffect";

export default function HomePage() {
  const { t, locale } = useI18n();
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

  const activeFilters = [
    filters.category,
    filters.watermark,
    filters.audio_support,
    filters.free_access_type,
  ].filter(Boolean);

  const toggleFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "" : value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      watermark: "",
      audio_support: "",
      free_access_type: "",
      sort_by: "quality_score",
      sort_order: "desc",
    });
  };

  const filteredTools = useMemo(() => {
    let result = [...allTools];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (locale === "zh"
            ? t.description_zh?.toLowerCase().includes(q)
            : t.description_en?.toLowerCase().includes(q))
      );
    }

    if (filters.category)
      result = result.filter((t) => t.category === filters.category);
    if (filters.watermark)
      result = result.filter((t) => t.watermark === filters.watermark);
    if (filters.audio_support)
      result = result.filter(
        (t) => t.audio_support === filters.audio_support
      );
    if (filters.free_access_type)
      result = result.filter(
        (t) => t.free_access_type === filters.free_access_type
      );

    const sortField = filters.sort_by;
    const sortOrder = filters.sort_order === "desc" ? -1 : 1;
    result.sort((a, b) => {
      const va = a[sortField] ?? 0;
      const vb = b[sortField] ?? 0;
      return (va - vb) * sortOrder;
    });

    return result;
  }, [filters, locale, allTools]);

  const quickFilters = [
    { key: "free_access_type" as const, label: locale === "zh" ? "免费" : "Free", value: "Free Forever" },
    { key: "free_access_type" as const, label: locale === "zh" ? "Freemium" : "Freemium", value: "Freemium" },
    { key: "watermark" as const, label: locale === "zh" ? "无水印" : "No Watermark", value: "No Watermark" },
    { key: "audio_support" as const, label: locale === "zh" ? "支持音频" : "Audio", value: "Audio Supported" },
    { key: "category" as const, label: locale === "zh" ? "文生视频" : "Text-to-Video", value: "Text-to-Video" },
    { key: "category" as const, label: locale === "zh" ? "数字人" : "Avatar", value: "Avatar & Talking Head" },
  ];

  return (
    <div className="min-h-screen">
      {/* ========== HERO SECTION ========== */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-primary-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-gradient-to-l from-cyan-500/10 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 progress-pulse" />
                <span className="text-xs text-primary-300 font-medium">
                  {locale === "zh" ? "每周更新 · 数据驱动" : "Weekly updates · Data-driven"}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">
                {locale === "zh" ? (
                  <>
                    找到最适合你的{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">
                      AI 视频工具
                    </span>
                  </>
                ) : (
                  <>
                    Find the Perfect{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">
                      AI Video Tool
                    </span>
                  </>
                )}
              </h1>

              <p className="text-lg text-dark-400 mb-8 max-w-lg leading-relaxed">
                {locale === "zh"
                  ? "客观对比 140+ AI 视频生成工具，涵盖画质、速度、易用性、价格等维度，帮你快速做出决策。"
                  : "Compare 140+ AI video generation tools across quality, speed, ease of use, and pricing. Make informed decisions fast."}
              </p>

              {/* Search bar in hero */}
              <div className="relative mb-6 max-w-lg">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400"
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
                  placeholder={
                    locale === "zh"
                      ? "搜索工具名称、类别或用例..."
                      : "Search tools by name, category or use case..."
                  }
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="w-full pl-12 pr-4 py-4 bg-dark-800/80 border border-dark-600 rounded-2xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-base backdrop-blur-sm"
                />
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {allTools.length}+
                  </div>
                  <div className="text-xs text-dark-400 mt-1">
                    {locale === "zh" ? "收录工具" : "Tools"}
                  </div>
                </div>
                <div className="w-px h-10 bg-dark-700" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {CATEGORIES.length}+
                  </div>
                  <div className="text-xs text-dark-400 mt-1">
                    {locale === "zh" ? "类别覆盖" : "Categories"}
                  </div>
                </div>
                <div className="w-px h-10 bg-dark-700" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {locale === "zh" ? "每周" : "Weekly"}
                  </div>
                  <div className="text-xs text-dark-400 mt-1">
                    {locale === "zh" ? "数据更新" : "Updates"}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Interactive Radar */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-[480px] h-[400px]">
                <RadarEffect tools={allTools.map(t => ({
                  id: t.id,
                  name: t.name,
                  category: t.category,
                  quality_score: t.quality_score,
                  speed_score: t.speed_score,
                  ease_score: t.ease_score,
                }))} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== QUICK FILTERS SECTION ========== */}
      <section className="px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-dark-400 mr-1">
              {locale === "zh" ? "快速筛选：" : "Quick filters:"}
            </span>
            {quickFilters.map((qf) => {
              const isActive = filters[qf.key] === qf.value;
              return (
                <button
                  key={`${qf.key}-${qf.value}`}
                  onClick={() => toggleFilter(qf.key, qf.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-600/25"
                      : "bg-dark-800 text-dark-300 hover:text-white hover:bg-dark-700 border border-dark-700"
                  }`}
                >
                  {qf.label}
                </button>
              );
            })}
            {activeFilters.length > 0 && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-full text-sm text-dark-400 hover:text-red-400 transition-colors"
              >
                {locale === "zh" ? "清除全部" : "Clear all"}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ========== TOOLS GRID SECTION ========== */}
      <section className="px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">
                {locale === "zh" ? "全部工具" : "All Tools"}
              </h2>
              <p className="text-sm text-dark-400 mt-1">
                {locale === "zh"
                  ? `共 ${filteredTools.length} 款工具`
                  : `${filteredTools.length} tools found`}
              </p>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-dark-500 hidden sm:inline">
                {locale === "zh" ? "排序：" : "Sort:"}
              </span>
              <select
                value={filters.sort_by}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sort_by: e.target.value as FilterState["sort_by"],
                  }))
                }
                className="bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-sm text-dark-200 focus:outline-none focus:border-primary-500"
              >
                <option value="quality_score">
                  {locale === "zh" ? "画质评分" : "Quality"}
                </option>
                <option value="speed_score">
                  {locale === "zh" ? "速度评分" : "Speed"}
                </option>
                <option value="ease_score">
                  {locale === "zh" ? "易用性" : "Ease of Use"}
                </option>
                <option value="max_duration">
                  {locale === "zh" ? "最大时长" : "Max Duration"}
                </option>
              </select>
              <button
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    sort_order: prev.sort_order === "desc" ? "asc" : "desc",
                  }))
                }
                className="px-2.5 py-2 rounded-xl border border-dark-700 text-dark-400 hover:text-white hover:border-dark-600 transition-colors text-sm"
              >
                {filters.sort_order === "desc" ? "↓" : "↑"}
              </button>
            </div>
          </div>

          {filteredTools.length === 0 ? (
            <div className="text-center py-20">
              <svg
                className="w-16 h-16 text-dark-600 mx-auto mb-4"
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
              <p className="text-dark-400">
                {locale === "zh" ? "没有符合条件的结果" : "No tools match your criteria"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-r from-primary-600/10 via-purple-600/10 to-primary-600/10 border border-primary-500/10 rounded-3xl p-10">
            <h2 className="text-2xl font-bold text-white mb-3">
              {locale === "zh"
                ? "不确定选哪个工具？"
                : "Not sure which tool to pick?"}
            </h2>
            <p className="text-dark-400 mb-8 max-w-md mx-auto">
              {locale === "zh"
                ? "回答几个简单问题，我们帮你推荐最合适的 AI 视频工具。"
                : "Answer a few quick questions and we'll recommend the best AI video tool for you."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/find-my-tool"
                className="px-8 py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-primary-600/25"
              >
                {locale === "zh" ? "帮我选工具 →" : "Find My Tool →"}
              </Link>
              <Link
                href="/compare"
                className="px-8 py-3.5 bg-dark-800 hover:bg-dark-700 text-dark-200 font-semibold rounded-xl transition-all border border-dark-700"
              >
                {locale === "zh" ? "对比工具" : "Compare Tools"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
