import fs from "node:fs/promises";
import path from "node:path";
const root = path.resolve(import.meta.dirname, ".."); const dist = path.join(root, "dist");
await fs.rm(dist, { recursive: true, force: true }); await fs.mkdir(dist, { recursive: true });
for (const entry of ["src", "public"]) await fs.cp(path.join(root, entry), path.join(dist, entry), { recursive: true });
const pkg = JSON.parse(await fs.readFile(path.join(root, "package.json"), "utf8"));
await fs.writeFile(path.join(dist, "package.json"), JSON.stringify({ name: pkg.name, version: pkg.version, private: true, type: "module", scripts: { start: "node src/server.mjs" } }, null, 2));
console.log("Сборка создана в dist/");
