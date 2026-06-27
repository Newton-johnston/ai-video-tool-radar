"use client";

import { useParams } from "next/navigation";
import { useI18n } from "@/context/I18nContext";
import { useCompare } from "@/context/CompareContext";
import { useTool } from "@/hooks/useTools";
import Link from "next/link";

function ScoreBar({ score, label, color }: { score: number | null; label: string; color: string }) {
  const val = score ?? 0;
  const pct = (val / 5) * 100;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-dark-400 w-10 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-dark-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm text-white font-semibold w-6 text-right tabular-nums">
        {score ?? "-"}
      </span>
    </div>
  );
}

export default function ToolDetailPage() {
  const params = useParams();
  const { t, locale } = useI18n();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { tool, loading } = useTool(Number(params.id));

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Tool Not Found</h1>
        <Link href="/discover" className="text-primary-400 hover:text-primary-300">
          {t("detail.back")}
        </Link>
      </div>
    );
  }

  const inCompare = isInCompare(tool.id);
  const description = locale === "zh" ? tool.description_zh : tool.description_en;
  const bestFor = locale === "zh" ? tool.best_for_zh : tool.best_for_en;
  const limitation = locale === "zh" ? tool.limitation_zh : tool.limitation_en;

  const displayValue = (val: string | null | undefined): string => {
    if (!val || val === "0") return t("detail.notVerified");
    return val;
  };

  const getFreeColor = (type: string) => {
    switch (type) {
      case "Free Forever": return "text-green-400 bg-green-500/15 border-green-500/25";
      case "Paid Only": return "text-red-400 bg-red-500/15 border-red-500/25";
      case "Free Trial": return "text-blue-400 bg-blue-500/15 border-blue-500/25";
      default: return "text-purple-400 bg-purple-500/15 border-purple-500/25";
    }
  };

  const getFreeLabel = (type: string) => {
    switch (type) {
      case "Free Forever": return locale === "zh" ? "免费" : "Free";
      case "Paid Only": return locale === "zh" ? "付费" : "Paid";
      case "Free Trial": return locale === "zh" ? "试用" : "Trial";
      default: return "Freemium";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link
        href="/discover"
        className="inline-flex items-center gap-1 text-dark-400 hover:text-white text-sm mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t("detail.back")}
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20">
          {tool.category}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getFreeColor(tool.free_access_type)}`}>
          {getFreeLabel(tool.free_access_type)}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-dark-700 text-dark-400 border border-dark-600">
          {locale === "zh" ? "已验证" : "Verified"}
        </span>
        <a
          href={tool.official_url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto px-4 py-1.5 rounded-full text-xs font-medium bg-primary-600/10 text-primary-400 border border-primary-600/20 hover:bg-primary-600/20 transition-colors"
        >
          {t("detail.visitOfficial")} ↗
        </a>
      </div>

      <h1 className="text-3xl font-bold text-white mb-2">{tool.name}</h1>
      <p className="text-dark-400 mb-8">{tool.primary_use_case}</p>

      {/* Main grid: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Left column: Free Access + Video Output */}
        <div className="space-y-4">
          {/* Free Access card */}
          <div className="bg-dark-850 border border-dark-700 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              {locale === "zh" ? "免费获取" : "Free Access"}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-dark-700">
                <span className="text-sm text-dark-400">
                  {locale === "zh" ? "免费类型" : "Access Type"}
                </span>
                <span className={`text-sm font-medium px-2.5 py-0.5 rounded-md border ${getFreeColor(tool.free_access_type)}`}>
                  {getFreeLabel(tool.free_access_type)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-dark-700">
                <span className="text-sm text-dark-400">
                  {locale === "zh" ? "免费额度" : "Free Limit"}
                </span>
                <span className="text-sm text-dark-200">{displayValue(tool.free_limit)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-dark-700">
                <span className="text-sm text-dark-400">
                  {locale === "zh" ? "水印" : "Watermark"}
                </span>
                <span className={`text-sm font-medium ${tool.watermark === "No Watermark" ? "text-green-400" : "text-amber-400"}`}>
                  {tool.watermark === "No Watermark"
                    ? locale === "zh" ? "无水印" : "No Watermark"
                    : locale === "zh" ? "有水印" : "Has Watermark"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-dark-400">
                  {locale === "zh" ? "音频" : "Audio"}
                </span>
                <span className={`text-sm font-medium ${tool.audio_support === "Audio Supported" ? "text-green-400" : "text-dark-500"}`}>
                  {tool.audio_support === "Audio Supported"
                    ? locale === "zh" ? "支持音频" : "Audio Supported"
                    : locale === "zh" ? "无音频" : "No Audio"}
                </span>
              </div>
            </div>
          </div>

          {/* Video Output card */}
          <div className="bg-dark-850 border border-dark-700 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              {locale === "zh" ? "视频输出" : "Video Output"}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-dark-700">
                <span className="text-sm text-dark-400">
                  {locale === "zh" ? "最大时长" : "Max Duration"}
                </span>
                <span className="text-sm text-dark-200">
                  {tool.max_duration
                    ? `${tool.max_duration}s`
                    : t("detail.notVerified")}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-dark-700">
                <span className="text-sm text-dark-400">
                  {locale === "zh" ? "画质评分" : "Quality Score"}
                </span>
                <span className="text-sm font-semibold text-green-400">
                  {tool.quality_score ?? "?"}/5
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-dark-400">
                  {locale === "zh" ? "速度评分" : "Speed Score"}
                </span>
                <span className="text-sm font-semibold text-blue-400">
                  {tool.speed_score ?? "?"}/5
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Scores + Verification */}
        <div className="space-y-4">
          {/* Scores card */}
          <div className="bg-dark-850 border border-dark-700 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              {locale === "zh" ? "评分" : "Scores"}
            </h3>
            <div className="space-y-4">
              <ScoreBar score={tool.quality_score} label={locale === "zh" ? "画质" : "Quality"} color="bg-green-400" />
              <ScoreBar score={tool.speed_score} label={locale === "zh" ? "速度" : "Speed"} color="bg-blue-400" />
              <ScoreBar score={tool.ease_score} label={locale === "zh" ? "易用" : "Ease"} color="bg-purple-400" />
            </div>
          </div>

          {/* Verification card */}
          <div className="bg-dark-850 border border-dark-700 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              {locale === "zh" ? "验证信息" : "Verification"}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-dark-700">
                <span className="text-sm text-dark-400">
                  {locale === "zh" ? "最后验证" : "Last Verified"}
                </span>
                <span className="text-sm text-dark-200">{tool.last_verified || t("detail.notVerified")}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-dark-400">
                  {locale === "zh" ? "来源" : "Source"}
                </span>
                {tool.source_url ? (
                  <a
                    href={tool.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-400 hover:text-primary-300"
                  >
                    {locale === "zh" ? "查看来源" : "View Source"} ↗
                  </a>
                ) : (
                  <span className="text-sm text-dark-500">{t("detail.notVerified")}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="bg-dark-850 border border-dark-700 rounded-2xl p-5 mb-4">
          <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
            {locale === "zh" ? "描述" : "Description"}
          </h3>
          <p className="text-dark-300 leading-relaxed text-sm">{description}</p>
        </div>
      )}

      {/* Best For + Limitation row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {bestFor && (
          <div className="bg-dark-850 border border-dark-700 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
              {locale === "zh" ? "最佳用途" : "Best For"}
            </h3>
            <p className="text-dark-300 text-sm leading-relaxed">{bestFor}</p>
          </div>
        )}
        {limitation && (
          <div className="bg-dark-850 border border-dark-700 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
              {locale === "zh" ? "限制说明" : "Limitation"}
            </h3>
            <p className="text-amber-400/80 text-sm leading-relaxed">{limitation}</p>
          </div>
        )}
      </div>

      {/* Compare button */}
      <div className="text-center">
        <button
          onClick={() =>
            inCompare ? removeFromCompare(tool.id) : addToCompare(tool.id)
          }
          className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all ${
            inCompare
              ? "bg-primary-600/20 text-primary-400 border border-primary-600/40"
              : "bg-dark-800 text-dark-200 border border-dark-700 hover:border-dark-600 hover:bg-dark-750"
          }`}
        >
          {inCompare ? "✓ " : ""}
          {t("detail.addToCompare")}
        </button>
      </div>
    </div>
  );
}
