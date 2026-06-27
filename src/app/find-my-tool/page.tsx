"use client";

import { useState, useMemo } from "react";
import { useI18n } from "@/context/I18nContext";
import { mockTools } from "@/data/mockTools";
import { Tool } from "@/types/tool";
import Link from "next/link";

type Step = "q1" | "q2" | "q3" | "q4" | "results";

interface Answers {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
}

const defaultAnswers: Answers = {
  q1: "",
  q2: "",
  q3: "",
  q4: "",
};

// ---------- Option card configs with icons ----------

function IconTextToVideo() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}
function IconImageToVideo() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
    </svg>
  );
}
function IconVideoToVideo() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  );
}
function Icon3D() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
  );
}
function IconAvatar() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}
function IconLongVideo() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
    </svg>
  );
}
function IconFree() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function IconPaid() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5 0h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-6H2.25" />
    </svg>
  );
}
function IconAudio() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
  );
}
function IconNoAudio() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
  );
}
function IconQuality() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}
function IconSpeed() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}
function IconEase() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
    </svg>
  );
}
function IconDuration() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

// ---------- Card component ----------

function OptionCard({
  icon,
  title,
  description,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
        selected
          ? "border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/10"
          : "border-dark-700 bg-dark-850 hover:border-dark-500 hover:bg-dark-800"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
            selected
              ? "bg-primary-500/20 text-primary-400"
              : "bg-dark-800 text-dark-400 group-hover:text-dark-200"
          }`}
        >
          {icon}
        </div>
        <div>
          <h3
            className={`font-semibold mb-1 transition-colors ${
              selected ? "text-primary-300" : "text-white"
            }`}
          >
            {title}
          </h3>
          <p className="text-sm text-dark-400">{description}</p>
        </div>
        <div className="flex-shrink-0 ml-auto">
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              selected
                ? "border-primary-500 bg-primary-500"
                : "border-dark-600"
            }`}
          >
            {selected && (
              <svg
                className="w-3.5 h-3.5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

// ---------- Step progress bar ----------

function StepProgress({
  current,
  total = 4,
}: {
  current: number;
  total?: number;
}) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full flex-1 transition-all duration-300 ${
            i <= current ? "bg-primary-500" : "bg-dark-700"
          }`}
        />
      ))}
    </div>
  );
}

// ---------- Main page ----------

export default function FindMyToolPage() {
  const { t, locale } = useI18n();
  const [step, setStep] = useState<Step>("q1");
  const [answers, setAnswers] = useState<Answers>(defaultAnswers);

  const stepIndex = step === "q1" ? 0 : step === "q2" ? 1 : step === "q3" ? 2 : 3;

  const results = useMemo(() => {
    if (step !== "results") return [];

    let filtered = [...mockTools];

    const useCaseToCategory: Record<string, string[]> = {
      textToVideo: ["Text-to-Video"],
      imageToVideo: ["Image-to-Video"],
      videoToVideo: ["Video-to-Video", "Video Editing"],
      "3d": ["3D Generation"],
      avatar: ["Avatar & Talking Head"],
      longVideo: ["Text-to-Video", "Video Editing", "Long Video"],
    };

    if (answers.q1 && useCaseToCategory[answers.q1]) {
      filtered = filtered.filter((t) =>
        useCaseToCategory[answers.q1].includes(t.category)
      );
    }

    if (answers.q2 === "yes") {
      filtered = filtered.filter((t) => t.free_access_type === "Free Forever");
    }

    if (answers.q3 === "yes") {
      filtered = filtered.filter((t) => t.audio_support === "Audio Supported");
    }

    const priority = answers.q4;
    if (priority) {
      filtered.sort((a, b) => {
        const getScore = (tool: Tool): number => {
          switch (priority) {
            case "quality":
              return tool.quality_score ?? 0;
            case "speed":
              return tool.speed_score ?? 0;
            case "ease":
              return tool.ease_score ?? 0;
            case "long":
              return tool.max_duration ?? 0;
            default:
              return tool.quality_score ?? 0;
          }
        };
        return getScore(b) - getScore(a);
      });
    }

    return filtered.slice(0, 5);
  }, [answers, step]);

  const handleSelect = (question: keyof Answers, value: string) => {
    setAnswers((prev) => ({ ...prev, [question]: value }));
  };

  const handleNext = () => {
    if (step === "q1") setStep("q2");
    else if (step === "q2") setStep("q3");
    else if (step === "q3") setStep("q4");
    else if (step === "q4") setStep("results");
  };

  const handleBack = () => {
    if (step === "q2") setStep("q1");
    else if (step === "q3") setStep("q2");
    else if (step === "q4") setStep("q3");
  };

  const reset = () => {
    setAnswers(defaultAnswers);
    setStep("q1");
  };

  // ---------- Question screens ----------
  const currentAnswer = answers[step as keyof Answers];

  const q1Options = [
    {
      key: "textToVideo",
      title: t("findMyTool.q1_textToVideo"),
      desc: locale === "zh" ? "将文字描述转化为视频" : "Turn text descriptions into videos",
      icon: <IconTextToVideo />,
    },
    {
      key: "imageToVideo",
      title: t("findMyTool.q1_imageToVideo"),
      desc: locale === "zh" ? "将静态图片转化为动态视频" : "Animate static images into videos",
      icon: <IconImageToVideo />,
    },
    {
      key: "videoToVideo",
      title: t("findMyTool.q1_videoToVideo"),
      desc: locale === "zh" ? "对已有视频进行转换或编辑" : "Transform or edit existing videos",
      icon: <IconVideoToVideo />,
    },
    {
      key: "3d",
      title: t("findMyTool.q1_3d"),
      desc: locale === "zh" ? "生成 3D 模型或场景" : "Generate 3D models or scenes",
      icon: <Icon3D />,
    },
    {
      key: "avatar",
      title: t("findMyTool.q1_avatar"),
      desc: locale === "zh" ? "创建 AI 数字人或虚拟形象" : "Create AI avatars or talking heads",
      icon: <IconAvatar />,
    },
    {
      key: "longVideo",
      title: t("findMyTool.q1_longVideo"),
      desc: locale === "zh" ? "制作长视频内容" : "Create long-form video content",
      icon: <IconLongVideo />,
    },
  ];

  const q2Options = [
    {
      key: "yes",
      title: t("findMyTool.q2_yes"),
      desc: locale === "zh" ? "优先选择完全免费的工具" : "Prefer completely free tools",
      icon: <IconFree />,
    },
    {
      key: "no",
      title: t("findMyTool.q2_no"),
      desc: locale === "zh" ? "付费工具也可以接受" : "Paid tools are acceptable",
      icon: <IconPaid />,
    },
  ];

  const q3Options = [
    {
      key: "yes",
      title: t("findMyTool.q3_yes"),
      desc: locale === "zh" ? "需要生成带音频的视频" : "Need videos with audio generation",
      icon: <IconAudio />,
    },
    {
      key: "no",
      title: t("findMyTool.q3_no"),
      desc: locale === "zh" ? "仅需视频画面，无需音频" : "Visual-only video is sufficient",
      icon: <IconNoAudio />,
    },
  ];

  const q4Options = [
    {
      key: "quality",
      title: t("findMyTool.q4_quality"),
      desc: locale === "zh" ? "追求最高画质和真实感" : "Pursue the highest quality and realism",
      icon: <IconQuality />,
    },
    {
      key: "speed",
      title: t("findMyTool.q4_speed"),
      desc: locale === "zh" ? "需要快速生成视频" : "Need fast video generation",
      icon: <IconSpeed />,
    },
    {
      key: "ease",
      title: t("findMyTool.q4_ease"),
      desc: locale === "zh" ? "希望操作简单易上手" : "Want something easy to use",
      icon: <IconEase />,
    },
    {
      key: "long",
      title: t("findMyTool.q4_long"),
      desc: locale === "zh" ? "需要生成长时间视频" : "Need long duration video generation",
      icon: <IconDuration />,
    },
  ];

  const getQuestionConfig = () => {
    switch (step) {
      case "q1":
        return { title: t("findMyTool.q1"), subtitle: locale === "zh" ? "选择你主要的使用场景" : "Choose your primary use case", options: q1Options };
      case "q2":
        return { title: t("findMyTool.q2"), subtitle: locale === "zh" ? "你对价格有什么要求？" : "What are your budget requirements?", options: q2Options };
      case "q3":
        return { title: t("findMyTool.q3"), subtitle: locale === "zh" ? "是否需要音频生成功能？" : "Do you need audio generation?", options: q3Options };
      case "q4":
        return { title: t("findMyTool.q4"), subtitle: locale === "zh" ? "选择你最看重的特性" : "Choose your top priority", options: q4Options };
      default:
        return { title: "", subtitle: "", options: [] as typeof q1Options };
    }
  };

  const config = getQuestionConfig();

  // ---------- Question screens ----------
  if (step === "q1" || step === "q2" || step === "q3" || step === "q4") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <StepProgress current={stepIndex} total={4} />
        <div className="mb-8">
          <p className="text-sm text-primary-400 font-medium mb-2">
            {locale === "zh" ? `步骤 ${stepIndex + 1}/4` : `Step ${stepIndex + 1} of 4`}
          </p>
          <h2 className="text-2xl font-bold text-white mb-2">{config.title}</h2>
          <p className="text-dark-400">{config.subtitle}</p>
        </div>
        <div className="space-y-3 mb-8">
          {config.options.map((opt) => (
            <OptionCard
              key={opt.key}
              icon={opt.icon}
              title={opt.title}
              description={opt.desc}
              selected={currentAnswer === opt.key}
              onClick={() => handleSelect(step as keyof Answers, opt.key)}
            />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
              step === "q1"
                ? "text-dark-600 cursor-not-allowed"
                : "text-dark-300 hover:text-white hover:bg-dark-800 border border-dark-700"
            }`}
            disabled={step === "q1"}
          >
            ← {t("findMyTool.back")}
          </button>
          <button
            onClick={handleNext}
            disabled={!currentAnswer}
            className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all ${
              currentAnswer
                ? "bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/25"
                : "bg-dark-700 text-dark-500 cursor-not-allowed"
            }`}
          >
            {step === "q4"
              ? locale === "zh" ? "查看结果" : "View Results"
              : t("findMyTool.next")}
          </button>
        </div>
      </div>
    );
  }

  // ---------- Results screen ----------
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm text-green-400 font-medium">
            {locale === "zh" ? `为你找到 ${results.length} 款推荐工具` : `Found ${results.length} recommendations`}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">
          {t("findMyTool.results")}
        </h1>
        <button
          onClick={reset}
          className="text-primary-400 hover:text-primary-300 text-sm transition-colors"
        >
          {t("findMyTool.retry")}
        </button>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-16 bg-dark-850 border border-dark-800 rounded-2xl">
          <svg className="w-16 h-16 text-dark-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-dark-500 text-lg">{t("findMyTool.noResults")}</p>
          <button
            onClick={reset}
            className="mt-4 px-6 py-2.5 bg-dark-800 hover:bg-dark-700 text-dark-200 rounded-xl text-sm font-medium border border-dark-700 transition-colors"
          >
            {t("findMyTool.retry")}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((tool, idx) => (
            <Link
              key={tool.id}
              href={`/tool/${tool.id}`}
              className="block bg-dark-850 border border-dark-800 hover:border-primary-500/40 rounded-2xl p-5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                  idx === 0
                    ? "bg-primary-500/20 text-primary-400"
                    : "bg-dark-800 text-dark-400"
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-lg group-hover:text-primary-400 transition-colors">
                    {tool.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-dark-500 bg-dark-800 px-2 py-0.5 rounded-lg">
                      {tool.category}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-lg ${
                      tool.free_access_type === "Free Forever"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-blue-500/10 text-blue-400"
                    }`}>
                      {tool.free_access_type}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-center">
                    <div className="text-xs text-dark-500 mb-1">{locale === "zh" ? "画质" : "Q"}</div>
                    <div className="text-sm font-bold text-white">{tool.quality_score ?? "-"}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-dark-500 mb-1">{locale === "zh" ? "速度" : "S"}</div>
                    <div className="text-sm font-bold text-white">{tool.speed_score ?? "-"}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-dark-500 mb-1">{locale === "zh" ? "易用" : "E"}</div>
                    <div className="text-sm font-bold text-white">{tool.ease_score ?? "-"}</div>
                  </div>
                  <svg className="w-5 h-5 text-dark-500 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
