"use client";

import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

type DataSource = "D1" | "localStorage" | "mock";

export default function DataSourceIndicator() {
  const [source, setSource] = useState<DataSource>("mock");

  useEffect(() => {
    if (!API_BASE) {
      setSource("mock");
      return;
    }

    fetch(`${API_BASE}/api/tools`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("API unreachable");
      })
      .then((data) => {
        if (data && data.length > 0) {
          setSource("D1");
        } else {
          // Check localStorage
          const stored = localStorage.getItem("admin_tools");
          setSource(stored ? "localStorage" : "mock");
        }
      })
      .catch(() => {
        const stored = localStorage.getItem("admin_tools");
        setSource(stored ? "localStorage" : "mock");
      });
  }, []);

  const config = {
    D1: { bg: "bg-green-500/20", text: "text-green-400", label: "D1 数据库" },
    localStorage: { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "本地存储 (localStorage)" },
    mock: { bg: "bg-gray-500/20", text: "text-gray-400", label: "Mock 数据" },
  };

  const { bg, text, label } = config[source];

  return (
    <div className={`fixed bottom-4 right-4 z-50 px-3 py-1.5 rounded-full text-xs font-mono ${bg} ${text} border border-current/20 backdrop-blur-sm`}>
      📡 数据源: {label}
    </div>
  );
}
