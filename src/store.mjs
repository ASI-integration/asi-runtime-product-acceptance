import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export class RequestStore {
  constructor(filePath) { this.filePath = filePath; }
  async read() {
    try { return JSON.parse(await fs.readFile(this.filePath, "utf8")); }
    catch (error) { if (error.code === "ENOENT") return []; throw error; }
  }
  async write(records) {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    const temporary = `${this.filePath}.${process.pid}.tmp`;
    await fs.writeFile(temporary, JSON.stringify(records, null, 2), "utf8");
    await fs.rename(temporary, this.filePath);
  }
  async list(filters = {}) {
    const records = await this.read();
    return records.filter((record) => ["property", "priority", "status"].every((key) => !filters[key] || record[key] === filters[key]));
  }
  async create(input) {
    const records = await this.read();
    const now = new Date().toISOString();
    const record = { id: randomUUID(), ...input, status: input.status || "Новая", createdAt: now, updatedAt: now };
    records.push(record); await this.write(records); return record;
  }
  async update(id, patch) {
    const records = await this.read();
    const index = records.findIndex((record) => record.id === id);
    if (index < 0) return null;
    records[index] = { ...records[index], ...patch, id, createdAt: records[index].createdAt, updatedAt: new Date().toISOString() };
    await this.write(records); return records[index];
  }
}
