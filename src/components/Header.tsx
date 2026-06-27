"use client";

import { useI18n } from "@/context/I18nContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const { t, locale, setLocale } = useI18n();
  const pathname = usePathname();

  const toggleLocale = () => {
    setLocale(locale === "en" ? "zh" : "en");
  };

  const isActive = (path: string) => {
    const currentPath = pathname || "/";
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive(path)
        ? "bg-primary-600/20 text-primary-400"
        : "text-dark-300 hover:text-white hover:bg-dark-800"
    }`;

  return (
    <header className="border-b border-dark-800 bg-dark-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-xl font-bold text-white tracking-tight"
            >
              <span className="text-primary-400">AI</span> Video Radar
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/discover" className={linkClass("/discover")}>
                {t("nav.discover")}
              </Link>
              <Link href="/compare" className={linkClass("/compare")}>
                {t("nav.compare")}
              </Link>
              <Link href="/find-my-tool" className={linkClass("/find-my-tool")}>
                {t("nav.findMyTool")}
              </Link>
              <Link href="/long-video" className={linkClass("/long-video")}>
                {t("nav.longVideo")}
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-xs text-dark-500 hover:text-dark-300 transition-colors"
            >
              {t("nav.admin")}
            </Link>
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-dark-700 text-dark-300 hover:text-white hover:border-dark-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span>{locale === "en" ? "中文" : "English"}</span>
            </button>
            <Link href="/submit" className={linkClass("/submit")}>
              {t("nav.submit")}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
