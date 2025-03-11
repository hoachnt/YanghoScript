#!/usr/bin/env node

import interpretCode from ".";
import fs from "node:fs";
import path from "node:path";

if (!process.argv[2]) {
	console.error("Error: You must specify a path to a file.");
	process.exit(1);
}

const filePath = process.argv[2];
const absolutePath = path.isAbsolute(filePath)
	? filePath
	: path.join(process.cwd(), filePath);

try {
	const data = fs.readFileSync(absolutePath, "utf8");
	interpretCode(data);
} catch (err) {
	console.error(err);
}
