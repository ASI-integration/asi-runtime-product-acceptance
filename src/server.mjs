import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { RequestStore } from "./store.mjs";
import { validateCreate, validatePatch } from "./validation.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const store = new RequestStore(process.env.DATA_FILE || path.join(root, "data", "requests.json"));
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8" };
const json = (res, status, value) => { res.writeHead(status, { "content-type": "application/json; charset=utf-8" }); res.end(JSON.stringify(value)); };
async function body(req) { const chunks = []; for await (const chunk of req) chunks.push(chunk); return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"); }

export function createServer() {
  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      if (url.pathname === "/api/requests" && req.method === "GET") return json(res, 200, await store.list(Object.fromEntries(url.searchParams)));
      if (url.pathname === "/api/requests" && req.method === "POST") {
        const input = await body(req); const errors = validateCreate(input);
        return errors.length ? json(res, 400, { errors }) : json(res, 201, await store.create(input));
      }
      const match = url.pathname.match(/^\/api\/requests\/([^/]+)$/);
      if (match && req.method === "PATCH") {
        const input = await body(req); const errors = validatePatch(input);
        if (errors.length) return json(res, 400, { errors });
        const record = await store.update(decodeURIComponent(match[1]), input);
        return record ? json(res, 200, record) : json(res, 404, { error: "Заявка не найдена" });
      }
      if (url.pathname.startsWith("/api/")) return json(res, 404, { error: "Маршрут не найден" });
      const relative = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
      const target = path.resolve(publicDir, relative);
      if (!target.startsWith(`${publicDir}${path.sep}`)) return json(res, 403, { error: "Доступ запрещён" });
      const content = await fs.readFile(target); res.writeHead(200, { "content-type": types[path.extname(target)] || "application/octet-stream" }); res.end(content);
    } catch (error) {
      if (error instanceof SyntaxError) return json(res, 400, { errors: ["Некорректный JSON"] });
      if (error.code === "ENOENT") return json(res, 404, { error: "Страница не найдена" });
      console.error(error); json(res, 500, { error: "Внутренняя ошибка сервера" });
    }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3000);
  createServer().listen(port, () => console.log(`ASI Mini Service Desk: http://localhost:${port}`));
}
