import { Tool, FilterState } from "@/types/tool";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function fetchTools(
  filters?: Partial<FilterState>
): Promise<Tool[]> {
  const params = new URLSearchParams();

  if (filters?.search) params.set("search", filters.search);
  if (filters?.category) params.set("category", filters.category);
  if (filters?.watermark) params.set("watermark", filters.watermark);
  if (filters?.audio_support) params.set("audio", filters.audio_support);
  if (filters?.free_access_type)
    params.set("free_access", filters.free_access_type);
  if (filters?.sort_by) params.set("sort_by", filters.sort_by);
  if (filters?.sort_order) params.set("sort_order", filters.sort_order);

  const qs = params.toString();
  const res = await fetch(`${API_BASE}/tools${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error("Failed to fetch tools");
  return res.json();
}

export async function fetchTool(id: number): Promise<Tool> {
  const res = await fetch(`${API_BASE}/tools/${id}`);
  if (!res.ok) throw new Error("Tool not found");
  return res.json();
}

export async function createTool(
  data: Omit<Tool, "id">,
  token: string
): Promise<Tool> {
  const res = await fetch(`${API_BASE}/admin/tools`, {
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

export async function updateTool(
  id: number,
  data: Partial<Tool>,
  token: string
): Promise<Tool> {
  const res = await fetch(`${API_BASE}/admin/tools/${id}`, {
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

export async function deleteTool(id: number, token: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/tools/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete tool");
}
