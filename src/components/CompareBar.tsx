"use client";

import { useCompare } from "@/context/CompareContext";
import { useI18n } from "@/context/I18nContext";
import Link from "next/link";

export default function CompareBar() {
  const { compareIds, clearCompare } = useCompare();
  const { t } = useI18n();

  if (compareIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-dark-800 border border-dark-600 rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-4 backdrop-blur-sm bg-dark-800/90">
      <span className="text-sm text-dark-300">
        {t("discover.compareSelected", { count: compareIds.length })}
      </span>
      <div className="flex items-center gap-2">
        <Link
          href="/compare"
          className="px-4 py-1.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {t("discover.compare")}
        </Link>
        <button
          onClick={clearCompare}
          className="px-3 py-1.5 text-sm text-dark-400 hover:text-red-400 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
