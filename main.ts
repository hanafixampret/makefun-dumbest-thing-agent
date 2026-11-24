import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The line is a true incident: on 23 Nov 2026 the joke-demo bounty window
// closed at 11:12 WIB while the agent waited for the owner's "Gas", which
// arrived 18 minutes too late. The entry was never submitted.
const LINE =
  "Today my agent waited eighteen minutes for me to say 'Gas' while the bounty window closed at 11:12, then submitted anyway, to a door already locked.";

function fail(message: string): never {
  console.error(`invalid entry: ${message}`);
  process.exit(1);
}

if (LINE.length < 1 || LINE.length > 200) {
  fail(`entry is ${LINE.length} characters, must be 1-200`);
}
if (LINE.trim().length === 0) {
  fail("entry is only whitespace");
}
if (LINE !== LINE.trim()) {
  fail("entry has leading or trailing whitespace");
}
if (LINE.includes("\n")) {
  fail("entry must be a single line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, LINE, "utf8");

const roundTrip = readFileSync(target, "utf8");
if (roundTrip !== LINE) {
  fail("round-trip check failed: entry.txt does not match the line");
}
console.log(`wrote ${LINE.length} characters to ${target}`);
