import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("acceptance repository baseline is available", () => {
  assert.equal(fs.existsSync("README.md"), true);
});