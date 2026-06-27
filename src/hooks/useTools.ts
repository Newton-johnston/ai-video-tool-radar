"use client";

import { useState, useEffect } from "react";
import { Tool, ToolSubmission } from "@/types/tool";
import { mockTools } from "@/data/mockTools";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

async function fetchFromAPI(path: string) {
  if (!API_BASE) return null;
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// Use API when available, fallback to localStorage/mock data
export function useTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Try API first
      const apiData = await fetchFromAPI("/api/tools");
      if (apiData && apiData.length > 0) {
        setTools(apiData);
        setLoading(false);
        return;
      }

      // Fallback: localStorage
      try {
        const stored = localStorage.getItem("admin_tools");
        if (stored) {
          setTools(JSON.parse(stored));
          setLoading(false);
          return;
        }
      } catch {}

      // Final fallback: mock data
      setTools([...mockTools]);
      setLoading(false);
    }
    load();
  }, []);

  return { tools, loading };
}

export function useTool(id: number) {
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Try API first
      const apiData = await fetchFromAPI(`/api/tools/${id}`);
      if (apiData && apiData.name) {
        setTool(apiData);
        setLoading(false);
        return;
      }

      // Fallback: localStorage
      try {
        const stored = localStorage.getItem("admin_tools");
        if (stored) {
          const tools: Tool[] = JSON.parse(stored);
          const found = tools.find((t) => t.id === id);
          if (found) {
            setTool(found);
            setLoading(false);
            return;
          }
        }
      } catch {}

      // Final fallback: mock data
      const found = mockTools.find((t) => t.id === id);
      setTool(found || null);
      setLoading(false);
    }
    load();
  }, [id]);

  return { tool, loading };
}

// Admin CRUD via API
export async function adminCreateTool(data: Partial<Tool>, token: string): Promise<Tool> {
  if (!API_BASE) throw new Error("API not configured");
  const res = await fetch(`${API_BASE}/api/admin/tools`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create tool");
  return res.json();
}

export async function adminUpdateTool(id: number, data: Partial<Tool>, token: string): Promise<Tool> {
  if (!API_BASE) throw new Error("API not configured");
  const res = await fetch(`${API_BASE}/api/admin/tools/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update tool");
  return res.json();
}

export async function adminDeleteTool(id: number, token: string): Promise<void> {
  if (!API_BASE) throw new Error("API not configured");
  const res = await fetch(`${API_BASE}/api/admin/tools/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete tool");
}

// Submit form via API
export async function submitTool(data: ToolSubmission): Promise<void> {
  if (!API_BASE) {
    // Fallback to localStorage
    const stored = localStorage.getItem("pending_submissions");
    const submissions: ToolSubmission[] = stored ? JSON.parse(stored) : [];
    submissions.push(data);
    localStorage.setItem("pending_submissions", JSON.stringify(submissions));
    return;
  }
  const res = await fetch(`${API_BASE}/api/admin/tools`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to submit tool");
}
