"use client";

import { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/context/I18nContext";
import { mockTools } from "@/data/mockTools";
import { Tool, CATEGORIES, FREE_ACCESS_TYPES, ToolSubmission } from "@/types/tool";

const ADMIN_PASSWORD = "admin123";

const emptyTool: Omit<Tool, "id"> = {
  name: "",
  official_url: "",
  category: "",
  primary_use_case: "",
  free_access_type: "",
  free_limit: "",
  watermark: "",
  audio_support: "",
  max_duration: null,
  quality_score: null,
  speed_score: null,
  ease_score: null,
  description_en: "",
  description_zh: "",
  last_verified: new Date().toISOString().split("T")[0],
  source_url: "",
};

function getStoredTools(): Tool[] {
  try {
    const stored = localStorage.getItem("admin_tools");
    return stored ? JSON.parse(stored) : [...mockTools];
  } catch {
    return [...mockTools];
  }
}

function getStoredSubmissions(): ToolSubmission[] {
  try {
    const stored = localStorage.getItem("pending_submissions");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export default function AdminPage() {
  const { t } = useI18n();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tools, setTools] = useState<Tool[]>([]);
  const [submissions, setSubmissions] = useState<ToolSubmission[]>([]);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [formData, setFormData] = useState<Omit<Tool, "id">>(emptyTool);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"tools" | "submissions">("tools");
  const [editingSubmission, setEditingSubmission] =
    useState<ToolSubmission | null>(null);
  const [subEditData, setSubEditData] = useState({
    name: "",
    official_url: "",
    category: "",
    free_access_type: "",
    description_en: "",
    description_zh: "",
    submitter_email: "",
  });

  useEffect(() => {
    setTools(getStoredTools());
    setSubmissions(getStoredSubmissions());
  }, []);

  const saveTools = useCallback((updatedTools: Tool[]) => {
    setTools(updatedTools);
    localStorage.setItem("admin_tools", JSON.stringify(updatedTools));
  }, []);

  const saveSubmissions = useCallback(
    (updated: ToolSubmission[]) => {
      setSubmissions(updated);
      localStorage.setItem("pending_submissions", JSON.stringify(updated));
    },
    []
  );

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Invalid password");
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setPassword("");
  };

  // --- Tools CRUD ---
  const handleAdd = () => {
    setEditingTool(null);
    setFormData({
      ...emptyTool,
      last_verified: new Date().toISOString().split("T")[0],
    });
    setShowForm(true);
  };

  const handleEdit = (tool: Tool) => {
    setEditingTool(tool);
    const { id, ...rest } = tool;
    setFormData(rest);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm(t("admin.confirmDelete"))) {
      saveTools(tools.filter((t) => t.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.category) return;
    if (editingTool) {
      const updated = tools.map((t) =>
        t.id === editingTool.id ? { ...formData, id: editingTool.id } : t
      );
      saveTools(updated);
    } else {
      const newId = Math.max(0, ...tools.map((t) => t.id)) + 1;
      saveTools([...tools, { ...formData, id: newId }]);
    }
    setShowForm(false);
  };

  const updateField = (
    field: keyof typeof formData,
    value: string | number | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // --- Submission Review ---
  const openSubmissionEdit = (submission: ToolSubmission) => {
    setEditingSubmission(submission);
    setSubEditData({
      name: submission.name,
      official_url: submission.official_url,
      category: submission.category,
      free_access_type: submission.free_access_type,
      description_en: submission.description_en,
      description_zh: submission.description_zh || "",
      submitter_email: submission.submitter_email,
    });
  };

  const closeSubmissionEdit = () => {
    setEditingSubmission(null);
  };

  const approveSubmission = (
    submission: ToolSubmission,
    editedData?: {
      name: string;
      official_url: string;
      category: string;
      free_access_type: string;
      description_en: string;
      description_zh: string;
    }
  ) => {
    const allTools = getStoredTools();
    const newId = Math.max(0, ...allTools.map((t) => t.id)) + 1;

    const data = editedData || submission;

    const newTool: Tool = {
      id: newId,
      name: data.name,
      official_url: data.official_url,
      category: data.category,
      primary_use_case: "",
      free_access_type: data.free_access_type,
      free_limit: "",
      watermark: "",
      audio_support: "",
      max_duration: null,
      quality_score: null,
      speed_score: null,
      ease_score: null,
      description_en: data.description_en,
      description_zh: data.description_zh || data.description_en,
      last_verified: new Date().toISOString().split("T")[0],
      source_url: data.official_url,
    };

    const updatedTools = [...allTools, newTool];
    saveTools(updatedTools);

    const updatedSubmissions = submissions.map((s) =>
      s.id === submission.id
        ? {
            ...s,
            status: "approved" as const,
            reviewed_at: new Date().toISOString(),
          }
        : s
    );
    saveSubmissions(updatedSubmissions);
  };

  const rejectSubmission = (submission: ToolSubmission) => {
    const updated = submissions.map((s) =>
      s.id === submission.id
        ? {
            ...s,
            status: "rejected" as const,
            reviewed_at: new Date().toISOString(),
          }
        : s
    );
    saveSubmissions(updated);
  };

  // --- Login screen ---
  if (!authenticated) {
    return (
      <div className="max-w-sm mx-auto px-4 py-20">
        <h1 className="text-2xl font-bold text-white text-center mb-8">
          {t("admin.login")}
        </h1>
        <div className="bg-dark-850 border border-dark-800 rounded-xl p-6">
          <input
            type="password"
            placeholder={t("admin.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 mb-3"
          />
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-lg transition-colors"
          >
            {t("admin.loginBtn")}
          </button>
        </div>
      </div>
    );
  }

  const pendingCount = submissions.filter(
    (s) => s.status === "pending"
  ).length;

  const inputClass =
    "w-full px-3 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500";
  const labelClass = "block text-xs text-dark-400 mb-1";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">{t("admin.title")}</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            + {t("admin.addTool")}
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-dark-800 hover:bg-dark-700 text-dark-300 text-sm font-medium rounded-lg border border-dark-700 transition-colors"
          >
            {t("admin.logout")}
          </button>
        </div>
      </div>

      {/* ===== Tab Navigation ===== */}
      <div className="flex items-center gap-1 mb-6 bg-dark-850 border border-dark-800 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab("tools")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "tools"
              ? "bg-primary-600 text-white"
              : "text-dark-400 hover:text-white"
          }`}
        >
          {t("admin.manageTools")}
        </button>
        <button
          onClick={() => setActiveTab("submissions")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
            activeTab === "submissions"
              ? "bg-primary-600 text-white"
              : "text-dark-400 hover:text-white"
          }`}
        >
          Submissions
          {pendingCount > 0 && (
            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-xs">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {/* ===== Tools Table ===== */}
      {activeTab === "tools" && (
        <>
          {tools.length === 0 ? (
            <div className="text-center py-16 bg-dark-850 border border-dark-800 rounded-xl">
              <p className="text-dark-500">{t("admin.noTools")}</p>
            </div>
          ) : (
            <div className="bg-dark-850 border border-dark-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-800">
                      <th className="text-left p-4 text-dark-500 text-xs font-medium uppercase">
                        {t("admin.name")}
                      </th>
                      <th className="text-left p-4 text-dark-500 text-xs font-medium uppercase">
                        {t("admin.category")}
                      </th>
                      <th className="text-left p-4 text-dark-500 text-xs font-medium uppercase">
                        Free Access
                      </th>
                      <th className="text-left p-4 text-dark-500 text-xs font-medium uppercase">
                        Scores
                      </th>
                      <th className="text-right p-4 text-dark-500 text-xs font-medium uppercase">
                        {t("admin.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tools.map((tool) => (
                      <tr
                        key={tool.id}
                        className="border-b border-dark-800/50 hover:bg-dark-800/50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="text-white font-medium">
                            {tool.name}
                          </div>
                          <div className="text-dark-500 text-xs mt-0.5">
                            {tool.primary_use_case?.slice(0, 60)}
                            {tool.primary_use_case &&
                            tool.primary_use_case.length > 60
                              ? "..."
                              : ""}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-md bg-primary-600/10 text-primary-400 text-xs">
                            {tool.category}
                          </span>
                        </td>
                        <td className="p-4 text-dark-300 text-sm">
                          {tool.free_access_type || "-"}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-xs text-dark-400">
                            <span className="text-green-400">
                              Q:{tool.quality_score ?? "?"}
                            </span>
                            <span className="text-dark-600">|</span>
                            <span className="text-blue-400">
                              S:{tool.speed_score ?? "?"}
                            </span>
                            <span className="text-dark-600">|</span>
                            <span className="text-purple-400">
                              E:{tool.ease_score ?? "?"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(tool)}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-dark-800 text-dark-300 hover:text-white border border-dark-700 transition-colors"
                            >
                              {t("admin.edit")}
                            </button>
                            <button
                              onClick={() => handleDelete(tool.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-dark-800 text-red-400 hover:text-red-300 border border-dark-700 transition-colors"
                            >
                              {t("admin.delete")}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ===== Submissions Table ===== */}
      {activeTab === "submissions" && (
        <>
          {submissions.length === 0 ? (
            <div className="text-center py-16 bg-dark-850 border border-dark-800 rounded-xl">
              <p className="text-dark-500">
                No submissions yet.
              </p>
            </div>
          ) : (
            <div className="bg-dark-850 border border-dark-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-800">
                      <th className="text-left p-4 text-dark-500 text-xs font-medium uppercase">
                        Tool Name
                      </th>
                      <th className="text-left p-4 text-dark-500 text-xs font-medium uppercase">
                        Category
                      </th>
                      <th className="text-left p-4 text-dark-500 text-xs font-medium uppercase">
                        Pricing
                      </th>
                      <th className="text-left p-4 text-dark-500 text-xs font-medium uppercase">
                        Email
                      </th>
                      <th className="text-left p-4 text-dark-500 text-xs font-medium uppercase">
                        Status
                      </th>
                      <th className="text-left p-4 text-dark-500 text-xs font-medium uppercase">
                        Date
                      </th>
                      <th className="text-right p-4 text-dark-500 text-xs font-medium uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((sub) => (
                      <tr
                        key={sub.id}
                        className="border-b border-dark-800/50 hover:bg-dark-800/50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="text-white font-medium">
                            {sub.name}
                          </div>
                          <div className="text-dark-500 text-xs mt-0.5 line-clamp-1">
                            {sub.description_en.slice(0, 80)}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-md bg-primary-600/10 text-primary-400 text-xs">
                            {sub.category}
                          </span>
                        </td>
                        <td className="p-4 text-dark-300 text-sm">
                          {sub.free_access_type || "-"}
                        </td>
                        <td className="p-4 text-dark-400 text-sm">
                          {sub.submitter_email}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                              sub.status === "pending"
                                ? "bg-yellow-500/10 text-yellow-400"
                                : sub.status === "approved"
                                ? "bg-green-500/10 text-green-400"
                                : "bg-red-500/10 text-red-400"
                            }`}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="p-4 text-dark-400 text-sm">
                          {new Date(sub.submitted_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={sub.official_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-dark-800 text-dark-300 hover:text-white border border-dark-700 transition-colors"
                            >
                              Link
                            </a>
                            {sub.status === "pending" && (
                              <>
                                <button
                                  onClick={() => openSubmissionEdit(sub)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-600/30 transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => approveSubmission(sub)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-600/20 text-green-400 hover:bg-green-600/30 border border-green-600/30 transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => rejectSubmission(sub)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/30 transition-colors"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ===== Submission Edit Modal ===== */}
      {editingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-dark-850 border border-dark-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Review Submission</h2>
                <p className="text-dark-500 text-sm mt-1">
                  Edit fields below before approving, or approve as-is.
                </p>
              </div>
              <button
                onClick={closeSubmissionEdit}
                className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="sm:col-span-2">
                <label className={labelClass}>Tool Name *</label>
                <input
                  type="text"
                  value={subEditData.name}
                  onChange={(e) =>
                    setSubEditData((p) => ({ ...p, name: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Category *</label>
                <select
                  value={subEditData.category}
                  onChange={(e) =>
                    setSubEditData((p) => ({ ...p, category: e.target.value }))
                  }
                  className={inputClass}
                >
                  <option value="">Select...</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Free Access Type</label>
                <select
                  value={subEditData.free_access_type}
                  onChange={(e) =>
                    setSubEditData((p) => ({
                      ...p,
                      free_access_type: e.target.value,
                    }))
                  }
                  className={inputClass}
                >
                  <option value="">Select...</option>
                  {FREE_ACCESS_TYPES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Official URL</label>
                <input
                  type="url"
                  value={subEditData.official_url}
                  onChange={(e) =>
                    setSubEditData((p) => ({
                      ...p,
                      official_url: e.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Submitter Email</label>
                <input
                  type="email"
                  value={subEditData.submitter_email}
                  readOnly
                  className={`${inputClass} opacity-60 cursor-not-allowed`}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Description (English)</label>
                <textarea
                  value={subEditData.description_en}
                  onChange={(e) =>
                    setSubEditData((p) => ({
                      ...p,
                      description_en: e.target.value,
                    }))
                  }
                  className={inputClass}
                  rows={3}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Description (Chinese)</label>
                <textarea
                  value={subEditData.description_zh}
                  onChange={(e) =>
                    setSubEditData((p) => ({
                      ...p,
                      description_zh: e.target.value,
                    }))
                  }
                  className={inputClass}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeSubmissionEdit}
                className="px-4 py-2 bg-dark-800 hover:bg-dark-700 text-dark-300 text-sm font-medium rounded-lg border border-dark-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  approveSubmission(editingSubmission, subEditData);
                  closeSubmissionEdit();
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Approve with Edits
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Form Modal ===== */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-dark-850 border border-dark-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingTool ? t("admin.editTool") : t("admin.addTool")}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>{t("admin.name")} *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select...</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Free Access Type</label>
                <select
                  value={formData.free_access_type}
                  onChange={(e) =>
                    updateField("free_access_type", e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Select...</option>
                  {FREE_ACCESS_TYPES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Official URL</label>
                <input
                  type="url"
                  value={formData.official_url}
                  onChange={(e) => updateField("official_url", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Free Limit</label>
                <input
                  type="text"
                  value={formData.free_limit}
                  onChange={(e) => updateField("free_limit", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Watermark</label>
                <select
                  value={formData.watermark}
                  onChange={(e) => updateField("watermark", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select...</option>
                  <option value="No Watermark">No Watermark</option>
                  <option value="Has Watermark">Has Watermark</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Audio Support</label>
                <select
                  value={formData.audio_support}
                  onChange={(e) =>
                    updateField("audio_support", e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Select...</option>
                  <option value="Audio Supported">Audio Supported</option>
                  <option value="No Audio">No Audio</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Max Duration (seconds)</label>
                <input
                  type="number"
                  value={formData.max_duration ?? ""}
                  onChange={(e) =>
                    updateField(
                      "max_duration",
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Primary Use Case</label>
                <input
                  type="text"
                  value={formData.primary_use_case}
                  onChange={(e) =>
                    updateField("primary_use_case", e.target.value)
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Quality Score (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={formData.quality_score ?? ""}
                  onChange={(e) =>
                    updateField(
                      "quality_score",
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Speed Score (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={formData.speed_score ?? ""}
                  onChange={(e) =>
                    updateField(
                      "speed_score",
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Ease Score (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={formData.ease_score ?? ""}
                  onChange={(e) =>
                    updateField(
                      "ease_score",
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Source URL</label>
                <input
                  type="url"
                  value={formData.source_url}
                  onChange={(e) => updateField("source_url", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Last Verified</label>
                <input
                  type="date"
                  value={formData.last_verified}
                  onChange={(e) =>
                    updateField("last_verified", e.target.value)
                  }
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Description (English)</label>
                <textarea
                  value={formData.description_en}
                  onChange={(e) =>
                    updateField("description_en", e.target.value)
                  }
                  className={inputClass}
                  rows={3}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Description (Chinese)</label>
                <textarea
                  value={formData.description_zh}
                  onChange={(e) =>
                    updateField("description_zh", e.target.value)
                  }
                  className={inputClass}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-dark-800 hover:bg-dark-700 text-dark-300 text-sm font-medium rounded-lg border border-dark-700 transition-colors"
              >
                {t("admin.cancel")}
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {t("admin.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
