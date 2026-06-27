"use client";

import { useState, useCallback } from "react";
import { useI18n } from "@/context/I18nContext";
import {
  SUBMISSION_CATEGORIES,
  FREE_ACCESS_TYPES,
  ToolSubmission,
} from "@/types/tool";
import { submitTool } from "@/hooks/useTools";

export default function SubmitPage() {
  const { t, locale } = useI18n();

  const [form, setForm] = useState({
    name: "",
    official_url: "",
    category: "",
    free_access_type: "",
    description_en: "",
    description_zh: "",
    submitter_email: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isZh = locale === "zh";

  const validate = useCallback(() => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = isZh ? "请输入工具名称" : "Tool name is required";
    if (!form.official_url.trim()) {
      errs.official_url = isZh ? "请输入网站网址" : "Website URL is required";
    } else if (!/^https?:\/\/.+\..+/.test(form.official_url.trim())) {
      errs.official_url = isZh ? "请输入有效的网址" : "Please enter a valid URL";
    }
    if (!form.category) errs.category = isZh ? "请选择类别" : "Please select a category";
    if (!form.free_access_type)
      errs.free_access_type = isZh ? "请选择定价类型" : "Please select pricing type";
    if (!form.description_en.trim())
      errs.description_en = isZh ? "请输入英文描述" : "English description is required";
    if (!form.submitter_email.trim()) {
      errs.submitter_email = isZh ? "请输入邮箱" : "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.submitter_email.trim())) {
      errs.submitter_email = isZh ? "请输入有效的邮箱" : "Please enter a valid email";
    }
    return errs;
  }, [form, isZh]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const newSubmission: ToolSubmission = {
      id: Date.now(),
      name: form.name.trim(),
      official_url: form.official_url.trim(),
      category: form.category,
      free_access_type: form.free_access_type,
      description_en: form.description_en.trim(),
      description_zh: form.description_zh.trim() || form.description_en.trim(),
      submitter_email: form.submitter_email.trim(),
      status: "pending",
      submitted_at: new Date().toISOString(),
    };

    try {
      await submitTool(newSubmission);
    } catch {
      // Fallback to localStorage
      try {
        const stored = localStorage.getItem("pending_submissions");
        const submissions: ToolSubmission[] = stored ? JSON.parse(stored) : [];
        submissions.push(newSubmission);
        localStorage.setItem("pending_submissions", JSON.stringify(submissions));
      } catch {}
    }
    setSubmitted(true);
  };

  const inputClass =
    "w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white text-sm placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all";
  const labelClass = "block text-sm font-medium text-dark-300 mb-1.5";
  const errorClass = "text-red-400 text-xs mt-1";

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20">
        <div className="bg-dark-850 border border-dark-700 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
            <svg
              className="w-8 h-8 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isZh ? "提交成功！" : "Submitted Successfully!"}
          </h2>
          <p className="text-dark-400 mb-6 leading-relaxed">
            {isZh
              ? "你的工具已提交审核，我们会在 1-3 个工作日内完成审核。审核通过后将出现在工具列表中。"
              : "Your tool has been submitted for review. We'll review it within 1-3 business days. Once approved, it will appear in the tool list."}
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setForm({
                name: "",
                official_url: "",
                category: "",
                free_access_type: "",
                description_en: "",
                description_zh: "",
                submitter_email: "",
              });
            }}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl transition-colors"
          >
            {isZh ? "提交另一个工具" : "Submit Another Tool"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {isZh ? "提交工具" : "Submit a Tool"}
        </h1>
        <p className="text-dark-400 leading-relaxed">
          {isZh
            ? "发现了一款很棒的 AI 视频工具？提交到这里，审核通过后将会展示在工具列表中。"
            : "Found a great AI video tool? Submit it here. Once reviewed, it will be listed on our platform."}
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit}>
        <div className="bg-dark-850 border border-dark-700 rounded-2xl p-6 sm:p-8 space-y-5">
          {/* Tool Name */}
          <div>
            <label className={labelClass}>
              {isZh ? "工具名称" : "Tool Name"}{" "}
              <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder={isZh ? "例如：Sora" : "e.g. Sora"}
              className={inputClass}
            />
            {errors.name && <p className={errorClass}>{errors.name}</p>}
          </div>

          {/* Website URL */}
          <div>
            <label className={labelClass}>
              {isZh ? "网站网址" : "Website URL"}{" "}
              <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              value={form.official_url}
              onChange={(e) =>
                setForm((f) => ({ ...f, official_url: e.target.value }))
              }
              placeholder="https://example.com"
              className={inputClass}
            />
            {errors.official_url && (
              <p className={errorClass}>{errors.official_url}</p>
            )}
          </div>

          {/* Category & Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>
                {isZh ? "类别" : "Category"}{" "}
                <span className="text-red-400">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className={inputClass}
              >
                <option value="">
                  {isZh ? "请选择类别..." : "Select category..."}
                </option>
                {SUBMISSION_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className={errorClass}>{errors.category}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>
                {isZh ? "定价类型" : "Pricing Type"}{" "}
                <span className="text-red-400">*</span>
              </label>
              <select
                value={form.free_access_type}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    free_access_type: e.target.value,
                  }))
                }
                className={inputClass}
              >
                <option value="">
                  {isZh ? "请选择定价类型..." : "Select pricing type..."}
                </option>
                {FREE_ACCESS_TYPES.map((ft) => (
                  <option key={ft} value={ft}>
                    {ft}
                  </option>
                ))}
              </select>
              {errors.free_access_type && (
                <p className={errorClass}>{errors.free_access_type}</p>
              )}
            </div>
          </div>

          {/* Description (EN) */}
          <div>
            <label className={labelClass}>
              {isZh ? "简短描述（英文）" : "Short Description (English)"}{" "}
              <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.description_en}
              onChange={(e) =>
                setForm((f) => ({ ...f, description_en: e.target.value }))
              }
              placeholder={
                isZh
                  ? "简要描述这个工具的功能和特点..."
                  : "Briefly describe what this tool does..."
              }
              rows={3}
              className={inputClass}
            />
            {errors.description_en && (
              <p className={errorClass}>{errors.description_en}</p>
            )}
          </div>

          {/* Description (ZH) */}
          <div>
            <label className={labelClass}>
              {isZh ? "简短描述（中文，选填）" : "Short Description (Chinese, optional)"}
            </label>
            <textarea
              value={form.description_zh}
              onChange={(e) =>
                setForm((f) => ({ ...f, description_zh: e.target.value }))
              }
              placeholder={
                isZh
                  ? "用中文简要描述这个工具..."
                  : "Brief description in Chinese..."
              }
              rows={3}
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>
              {isZh ? "你的邮箱" : "Your Email"}{" "}
              <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={form.submitter_email}
              onChange={(e) =>
                setForm((f) => ({ ...f, submitter_email: e.target.value }))
              }
              placeholder="you@example.com"
              className={inputClass}
            />
            <p className="text-dark-500 text-xs mt-1">
              {isZh
                ? "仅用于审核通知，不会公开显示。"
                : "Only used for review notification, will not be shown publicly."}
            </p>
            {errors.submitter_email && (
              <p className={errorClass}>{errors.submitter_email}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary-600/25 active:scale-[0.99]"
            >
              {isZh ? "提交审核" : "Submit for Review"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
