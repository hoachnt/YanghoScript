#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("./index"));
var node_fs_1 = __importDefault(require("node:fs"));
var node_path_1 = __importDefault(require("node:path"));
var commander_1 = require("commander");
var package_json_1 = __importDefault(require("../package.json"));
// Read file with error handling
var readFileContent = function (filePath) {
    try {
        return node_fs_1.default.readFileSync(filePath, "utf8");
    }
    catch (error) {
        throw new Error("Error reading file: ".concat(error instanceof Error ? error.message : "Unknown error"));
    }
};
// Get absolute path
var getAbsolutePath = function (file) {
    return node_path_1.default.isAbsolute(file) ? file : node_path_1.default.join(process.cwd(), file);
};
// Validate file path
var validateFilePath = function (filePath) {
    if (!node_fs_1.default.existsSync(filePath)) {
        throw new Error("Error: File not found at path '".concat(filePath, "'"));
    }
};
// Execution handler
var handleFileExecution = function (file) {
    try {
        var absolutePath = getAbsolutePath(file);
        validateFilePath(absolutePath);
        var data = readFileContent(absolutePath);
        (0, index_1.default)(data);
    }
    catch (error) {
        console.error(error instanceof Error ? error.message : "An unknown error occurred");
        process.exit(1);
    }
};
// CLI setup
commander_1.program
    .name("yanghoscript")
    .description("YanghoScript CLI interpreter")
    .version(package_json_1.default.version, "-v, --version", "Output the version number")
    .argument("<file>", "Path to the YanghoScript file")
    .action(handleFileExecution);
commander_1.program.parse(process.argv);
