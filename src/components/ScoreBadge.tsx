"use client";

function getScoreColor(score: number): string {
  if (score >= 4) return "bg-green-500/20 text-green-400";
  if (score >= 3) return "bg-yellow-500/20 text-yellow-400";
  return "bg-red-500/20 text-red-400";
}

export default function ScoreBadge({
  score,
  max = 5,
  className = "",
}: {
  score: number | null;
  max?: number;
  className?: string;
}) {
  if (score === null || score === 0) {
    return (
      <span className={`text-dark-500 text-sm ${className}`}>Not verified</span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-sm font-medium ${getScoreColor(score)} ${className}`}
    >
      <span className="font-bold">{score}</span>
      <span className="text-xs opacity-70">/{max}</span>
    </span>
  );
}
