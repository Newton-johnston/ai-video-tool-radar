"use client";

import { Tool } from "@/types/tool";
import { useI18n } from "@/context/I18nContext";
import { useCompare } from "@/context/CompareContext";
import Link from "next/link";

function ScoreBar({ score, label }: { score: number | null; label: string }) {
  const val = score ?? 0;
  const pct = (val / 5) * 100;
  let color = "bg-dark-600";
  if (val >= 4) color = "bg-green-400";
  else if (val >= 3) color = "bg-yellow-400";
  else if (val > 0) color = "bg-red-400";

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-dark-400 w-10 flex-shrink-0 font-medium">
        {label}
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-dark-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-dark-300 w-6 text-right flex-shrink-0 font-semibold tabular-nums">
        {score ?? "-"}
      </span>
    </div>
  );
}

function getTagStyle(freeType: string) {
  switch (freeType) {
    case "Free Forever":
      return "bg-green-500/15 text-green-400 border-green-500/25";
    case "Paid Only":
      return "bg-red-500/15 text-red-400 border-red-500/25";
    case "Free Trial":
      return "bg-blue-500/15 text-blue-400 border-blue-500/25";
    default:
      return "bg-purple-500/15 text-purple-400 border-purple-500/25";
  }
}

function getFreeLabel(freeType: string, locale: string) {
  switch (freeType) {
    case "Free Forever":
      return locale === "zh" ? "免费" : "Free";
    case "Paid Only":
      return locale === "zh" ? "付费" : "Paid";
    case "Free Trial":
      return locale === "zh" ? "试用" : "Trial";
    default:
      return "Freemium";
  }
}

function getCategoryIcon(category: string) {
  const cls = "w-4 h-4";
  switch (category) {
    case "Text-to-Video":
      return <svg className={`${cls} text-purple-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>;
    case "Image-to-Video":
      return <svg className={`${cls} text-cyan-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>;
    case "Video-to-Video":
      return <svg className={`${cls} text-blue-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>;
    case "3D Generation":
      return <svg className={`${cls} text-orange-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>;
    case "Avatar & Talking Head":
      return <svg className={`${cls} text-pink-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
    case "Video Editing":
      return <svg className={`${cls} text-green-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>;
    case "Character Animation":
      return <svg className={`${cls} text-yellow-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" /></svg>;
    default:
      return <svg className={`${cls} text-dark-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>;
  }
}

export default function ToolCard({ tool }: { tool: Tool }) {
  const { t, locale } = useI18n();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const inCompare = isInCompare(tool.id);

  const description =
    locale === "zh" ? tool.description_zh : tool.description_en;
  const bestFor =
    locale === "zh" ? tool.best_for_zh : tool.best_for_en;
  const limitation =
    locale === "zh" ? tool.limitation_zh : tool.limitation_en;

  return (
    <div className="bg-dark-850 border border-dark-700 rounded-2xl p-5 hover:border-dark-600 transition-all duration-200 group hover:shadow-lg hover:shadow-black/20 flex flex-col">
      {/* Category tag + icon */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-center flex-shrink-0">
          {getCategoryIcon(tool.category)}
        </div>
        <span className="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20">
          {tool.category}
        </span>
      </div>

      {/* Tool name */}
      <Link href={`/tool/${tool.id}`}>
        <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors mb-2">
          {tool.name}
        </h3>
      </Link>

      {/* Attribute tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span
          className={`px-2.5 py-0.5 rounded-md text-xs font-medium border ${getTagStyle(tool.free_access_type)}`}
        >
          {getFreeLabel(tool.free_access_type, locale)}
        </span>
        {tool.watermark === "No Watermark" ? (
          <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/25">
            {locale === "zh" ? "无水印" : "No WM"}
          </span>
        ) : (
          <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-dark-700 text-dark-400 border border-dark-600">
            {locale === "zh" ? "有水印" : "WM"}
          </span>
        )}
        {tool.audio_support === "Audio Supported" ? (
          <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-500/15 text-purple-400 border border-purple-500/25">
            {locale === "zh" ? "音频" : "Audio"}
          </span>
        ) : (
          <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-dark-700 text-dark-400 border border-dark-600">
            {locale === "zh" ? "无音频" : "No Audio"}
          </span>
        )}
        {tool.max_duration && (
          <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-dark-800 text-dark-300 border border-dark-700">
            {tool.max_duration}s
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-dark-400 text-sm leading-relaxed mb-4 line-clamp-2">
        {description || t("discover.notVerified")}
      </p>

      {/* Score bars */}
      <div className="space-y-2 mb-4">
        <ScoreBar score={tool.quality_score} label={locale === "zh" ? "画质" : "Quality"} />
        <ScoreBar score={tool.speed_score} label={locale === "zh" ? "速度" : "Speed"} />
        <ScoreBar score={tool.ease_score} label={locale === "zh" ? "易用" : "Ease"} />
      </div>

      {/* Best for */}
      {bestFor && (
        <div className="mb-2">
          <span className="text-xs text-dark-500 font-medium uppercase tracking-wide">
            {t("discover.bestFor")}
          </span>
          <p className="text-xs text-dark-300 mt-0.5 leading-relaxed">{bestFor}</p>
        </div>
      )}

      {/* Limitation */}
      {limitation && (
        <div className="mb-4">
          <span className="text-xs text-dark-500 font-medium uppercase tracking-wide">
            {t("discover.limitation")}
          </span>
          <p className="text-xs text-amber-400/80 mt-0.5 leading-relaxed">{limitation}</p>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-dark-700">
        <Link
          href={`/tool/${tool.id}`}
          className="flex-1 text-center px-3 py-2 rounded-lg text-xs font-medium bg-dark-800 hover:bg-dark-700 text-dark-200 hover:text-white border border-dark-700 transition-colors"
        >
          {t("discover.details")}
        </Link>
        <a
          href={tool.official_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center px-3 py-2 rounded-lg text-xs font-medium bg-primary-600/10 hover:bg-primary-600/20 text-primary-400 border border-primary-600/20 transition-colors"
        >
          {t("discover.officialSite")}
        </a>
        <button
          onClick={() =>
            inCompare ? removeFromCompare(tool.id) : addToCompare(tool.id)
          }
          className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
            inCompare
              ? "bg-primary-600/20 text-primary-400 border border-primary-600/30"
              : "border border-dark-600 text-dark-500 hover:border-dark-500 hover:text-dark-300"
          }`}
          title={inCompare ? locale === "zh" ? "移除对比" : "Remove from compare" : locale === "zh" ? "加入对比" : "Add to compare"}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={inCompare ? "M6 18L18 6M6 6l12 12" : "M3 7v2h18V7H3zm0 8h18v-2H3v2z"}
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
