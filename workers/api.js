/**
 * Cloudflare Workers API for AI Video Tool Radar
 *
 * Routes:
 *   GET    /api/tools         - List tools (search, filter, sort)
 *   GET    /api/tools/:id     - Get tool detail
 *   POST   /api/admin/tools   - Create tool (auth required)
 *   PUT    /api/admin/tools/:id - Update tool (auth required)
 *   DELETE /api/admin/tools/:id - Delete tool (auth required)
 */

const ADMIN_TOKEN = "ai-video-radar-admin-token-2025";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

function error(message, status = 400) {
  return json({ error: message }, status);
}

function checkAuth(request) {
  const auth = request.headers.get("Authorization");
  return auth === `Bearer ${ADMIN_TOKEN}`;
}

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // GET /api/tools
      if (path === "/api/tools" && request.method === "GET") {
        return await listTools(url, env);
      }

      // GET /api/tools/:id
      const toolMatch = path.match(/^\/api\/tools\/(\d+)$/);
      if (toolMatch && request.method === "GET") {
        return await getTool(Number(toolMatch[1]), env);
      }

      // POST /api/admin/tools
      if (path === "/api/admin/tools" && request.method === "POST") {
        if (!checkAuth(request)) return error("Unauthorized", 401);
        return await createTool(request, env);
      }

      // PUT /api/admin/tools/:id
      const adminMatch = path.match(/^\/api\/admin\/tools\/(\d+)$/);
      if (adminMatch && request.method === "PUT") {
        if (!checkAuth(request)) return error("Unauthorized", 401);
        return await updateTool(Number(adminMatch[1]), request, env);
      }

      // DELETE /api/admin/tools/:id
      if (adminMatch && request.method === "DELETE") {
        if (!checkAuth(request)) return error("Unauthorized", 401);
        return await deleteTool(Number(adminMatch[1]), env);
      }

      return error("Not Found", 404);
    } catch (e) {
      console.error(e);
      return error("Internal Server Error", 500);
    }
  },
};

async function listTools(url, env) {
  const search = url.searchParams.get("search") || "";
  const category = url.searchParams.get("category") || "";
  const watermark = url.searchParams.get("watermark") || "";
  const audio = url.searchParams.get("audio") || "";
  const freeAccess = url.searchParams.get("free_access") || "";
  const sortBy = url.searchParams.get("sort_by") || "quality_score";
  const sortOrder = url.searchParams.get("sort_order") || "desc";

  // Build query with parameterized filters
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push("(name LIKE ? OR category LIKE ? OR primary_use_case LIKE ?)");
    const q = `%${search}%`;
    params.push(q, q, q);
  }

  if (category) {
    conditions.push("category = ?");
    params.push(category);
  }

  if (watermark) {
    conditions.push("watermark = ?");
    params.push(watermark);
  }

  if (audio) {
    conditions.push("audio_support = ?");
    params.push(audio);
  }

  if (freeAccess) {
    conditions.push("free_access_type = ?");
    params.push(freeAccess);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Validate sort column to prevent SQL injection
  const allowedSorts = ["quality_score", "speed_score", "ease_score", "max_duration", "name"];
  const sort = allowedSorts.includes(sortBy) ? sortBy : "quality_score";
  const order = sortOrder === "asc" ? "ASC" : "DESC";

  const query = `SELECT * FROM tools ${whereClause} ORDER BY ${sort} ${order}`;

  const { results } = await env.DB.prepare(query).bind(...params).all();
  return json(results);
}

async function getTool(id, env) {
  const tool = await env.DB.prepare("SELECT * FROM tools WHERE id = ?").bind(id).first();
  if (!tool) return error("Tool not found", 404);
  return json(tool);
}

async function createTool(request, env) {
  const body = await request.json();

  const required = ["name"];
  for (const field of required) {
    if (!body[field]) return error(`Field "${field}" is required`);
  }

  const fields = [
    "name", "official_url", "category", "primary_use_case",
    "free_access_type", "free_limit", "watermark", "audio_support",
    "max_duration", "quality_score", "speed_score", "ease_score",
    "description_en", "description_zh", "last_verified", "source_url",
  ];

  const columns = fields.filter((f) => body[f] !== undefined);
  const placeholders = columns.map(() => "?").join(", ");
  const values = columns.map((f) => body[f]);

  const result = await env.DB.prepare(
    `INSERT INTO tools (${columns.join(", ")}) VALUES (${placeholders})`
  )
    .bind(...values)
    .run();

  const tool = await env.DB.prepare("SELECT * FROM tools WHERE id = ?")
    .bind(result.meta.last_row_id)
    .first();

  return json(tool, 201);
}

async function updateTool(id, request, env) {
  const existing = await env.DB.prepare("SELECT * FROM tools WHERE id = ?").bind(id).first();
  if (!existing) return error("Tool not found", 404);

  const body = await request.json();

  const fields = [
    "name", "official_url", "category", "primary_use_case",
    "free_access_type", "free_limit", "watermark", "audio_support",
    "max_duration", "quality_score", "speed_score", "ease_score",
    "description_en", "description_zh", "last_verified", "source_url",
  ];

  const setClauses = fields
    .filter((f) => body[f] !== undefined)
    .map((f) => `${f} = ?`);
  const values = fields
    .filter((f) => body[f] !== undefined)
    .map((f) => body[f]);

  if (setClauses.length === 0) return error("No fields to update");

  setClauses.push("updated_at = datetime('now')");
  values.push(id);

  await env.DB.prepare(
    `UPDATE tools SET ${setClauses.join(", ")} WHERE id = ?`
  )
    .bind(...values)
    .run();

  const tool = await env.DB.prepare("SELECT * FROM tools WHERE id = ?").bind(id).first();
  return json(tool);
}

async function deleteTool(id, env) {
  const existing = await env.DB.prepare("SELECT * FROM tools WHERE id = ?").bind(id).first();
  if (!existing) return error("Tool not found", 404);

  await env.DB.prepare("DELETE FROM tools WHERE id = ?").bind(id).run();
  return json({ success: true, message: "Tool deleted" });
}
