"use client";

import { useI18n } from "@/context/I18nContext";
import Link from "next/link";

export default function Footer() {
  const { locale } = useI18n();

  return (
    <footer className="border-t border-dark-800 bg-dark-950/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center gap-4">
          {/* Logo + Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </div>
            <span className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">
              AI Video Tool Radar
            </span>
          </Link>

          {/* Disclaimer */}
          <p className="text-sm text-dark-400 max-w-2xl text-center leading-relaxed">
            {locale === "zh"
              ? "免责声明：本网站提供的信息仅供参考。我们尽力保持信息准确和最新，但不对任何错误或遗漏负责。AI 工具的功能和定价可能随时变化，请以各工具官网信息为准。"
              : "Disclaimer: The information provided on this website is for reference only. We strive to keep it accurate and up-to-date, but we are not responsible for any errors or omissions. AI tool features and pricing may change at any time — please refer to each tool's official website for the latest information."}
          </p>

          {/* Copyright */}
          <p className="text-xs text-dark-500">
            &copy; {new Date().getFullYear()} AI Video Tool Radar.{" "}
            {locale === "zh" ? "保留所有权利。" : "All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}
