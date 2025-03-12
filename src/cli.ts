#!/usr/bin/env node

import interpretCode from "./index";
import fs from "node:fs";
import path from "node:path";
import { program } from "commander";
import packageJson from "../package.json";

// Read file with error handling
const readFileContent = (filePath: string): string | never => {
	try {
		return fs.readFileSync(filePath, "utf8");
	} catch (error) {
		throw new Error(
			`Error reading file: ${
				error instanceof Error ? error.message : "Unknown error"
			}`
		);
	}
};

// Get absolute path
const getAbsolutePath = (file: string): string =>
	path.isAbsolute(file) ? file : path.join(process.cwd(), file);

// Validate file path
const validateFilePath = (filePath: string): void | never => {
	if (!fs.existsSync(filePath)) {
		throw new Error(`Error: File not found at path '${filePath}'`);
	}
};

// Execution handler
const handleFileExecution = (file: string): void => {
	try {
		const absolutePath = getAbsolutePath(file);
		validateFilePath(absolutePath);
		const data = readFileContent(absolutePath);
		interpretCode(data);
	} catch (error) {
		console.error(
			error instanceof Error ? error.message : "An unknown error occurred"
		);
		process.exit(1);
	}
};

// CLI setup
program
	.name("yanghoscript")
	.description("YanghoScript CLI interpreter")
	.version(packageJson.version, "-v, --version", "Output the version number")
	.argument("<file>", "Path to the YanghoScript file")
	.action(handleFileExecution);

program.parse(process.argv);
