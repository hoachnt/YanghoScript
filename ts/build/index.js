"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = interpretCode;
var Interpreter_1 = __importDefault(require("./core/Interpreter"));
var Lexer_1 = require("./core/Lexer");
var Parser_1 = __importDefault(require("./core/Parser"));
var tokens_1 = require("./tokens");
function interpretCode(code) {
    var createToken = (0, tokens_1.useToken)().createToken;
    var _a = (0, tokens_1.useTokenType)(), tokenTypesMap = _a.tokenTypesMap, tokenTypesList = _a.tokenTypesList;
    var lexer = (0, Lexer_1.createLexer)(code, {
        createToken: createToken,
        tokenTypesMap: tokenTypesMap,
        tokenTypesList: tokenTypesList,
    });
    var tokens = lexer.lexAnalysis();
    var parser = new Parser_1.default(tokens, code);
    var rootNode = parser.parseCode();
    new Interpreter_1.default().run(rootNode);
}
