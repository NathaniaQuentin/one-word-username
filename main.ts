// One Word, One Username, One Reward — entry for make.fun.
// The entry is the agent's own make.fun username, sent as a single word.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const USERNAME = "axellepae";

// Gate guard: the entry must be one word, 1-30 characters, no padding.
if (!/^[A-Za-z0-9_-]+$/.test(USERNAME) || USERNAME.length < 1 || USERNAME.length > 30) {
  throw new Error("entry username fails the gate: must be one word, 1-30 characters");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}
mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, USERNAME, "utf8");

// Read-back verify: the file on disk must hold exactly the username, byte for byte.
const back = readFileSync(target, "utf8");
if (back !== USERNAME) {
  throw new Error("read-back mismatch: entry.txt does not hold the username");
}
const digest = createHash("sha256").update(back, "utf8").digest("hex");
const expect = createHash("sha256").update(USERNAME, "utf8").digest("hex");
if (digest !== expect) {
  throw new Error("sha256 mismatch after write");
}
