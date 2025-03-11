#!/usr/bin/env node

import interpretCode from "./index";
import fs from "node:fs";
import path from "node:path";
import { program } from "commander";
import packageJson from "../package.json";

// Настройка CLI с commander
program
	.name("yanghoscript")
	.description("YanghoScript CLI interpreter")
	.version(packageJson.version, "-v, --version", "Output the version number")
	.argument("<file>", "Path to the YanghoScript file")
	.action((file) => {
		const absolutePath = path.isAbsolute(file)
			? file
			: path.join(process.cwd(), file);

		if (!fs.existsSync(absolutePath)) {
			console.error(`Error: File not found at path '${absolutePath}'`);
			process.exit(1);
		}

		try {
			const data = fs.readFileSync(absolutePath, "utf8");
			interpretCode(data);
		} catch (err) {
			if (err instanceof Error) {
				console.error(`Error reading file: ${err.message}`);
			} else {
				console.error('Error reading file');
			}
			process.exit(1);
		}
	});

program.parse(process.argv);
