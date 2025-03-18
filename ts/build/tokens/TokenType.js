"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTokenType = exports.TokenNames = void 0;
// Enum for token naming (enhances code safety)
var TokenNames;
(function (TokenNames) {
    TokenNames["NUMBER"] = "NUMBER";
    TokenNames["VARIABLE"] = "VARIABLE";
    TokenNames["SEMICOLON"] = "SEMICOLON";
    TokenNames["SPACE"] = "SPACE";
    TokenNames["ASSIGN"] = "ASSIGN";
    TokenNames["LOG"] = "LOG";
    TokenNames["MINUS"] = "MINUS";
    TokenNames["PLUS"] = "PLUS";
    TokenNames["MULT"] = "MULT";
    TokenNames["DIV"] = "DIV";
    TokenNames["EQUAL"] = "EQUAL";
    TokenNames["LESS"] = "LESS";
    TokenNames["MORE"] = "MORE";
    TokenNames["LESSEQ"] = "LESSEQ";
    TokenNames["MOREQ"] = "MOREQ";
    TokenNames["LPAR"] = "LPAR";
    TokenNames["RPAR"] = "RPAR";
    TokenNames["LBRACE"] = "LBRACE";
    TokenNames["RBRACE"] = "RBRACE";
    TokenNames["IF"] = "IF";
    TokenNames["ELSE"] = "ELSE";
    TokenNames["STRING"] = "STRING";
    TokenNames["SINGLE_LINE_COMMENT"] = "SINGLE_LINE_COMMENT";
    TokenNames["FUNCTION"] = "FUNCTION";
    TokenNames["RETURN"] = "RETURN";
    TokenNames["COMMA"] = "COMMA";
})(TokenNames || (exports.TokenNames = TokenNames = {}));
// Factory for creating tokens, ensuring function purity (FP)
var createTokenType = function (name, regex) { return ({
    name: name,
    regex: regex,
}); };
// Token definitions are extracted separately for easier editing and extendability
var tokenDefinitions = (_a = {},
    _a[TokenNames.NUMBER] = "[0-9]+",
    _a[TokenNames.VARIABLE] = "[a-z]+",
    _a[TokenNames.SEMICOLON] = "IM",
    _a[TokenNames.SPACE] = "[ \n\t\r]",
    _a[TokenNames.ASSIGN] = "\\=",
    _a[TokenNames.LOG] = "NOILIENTUC",
    _a[TokenNames.MINUS] = "\\-",
    _a[TokenNames.PLUS] = "\\+",
    _a[TokenNames.MULT] = "\\*",
    _a[TokenNames.DIV] = "\\/",
    _a[TokenNames.EQUAL] = "UYTIN",
    _a[TokenNames.LESS] = "ITHON",
    _a[TokenNames.MORE] = "NHIEUHON",
    _a[TokenNames.LESSEQ] = "ITBANG",
    _a[TokenNames.MOREQ] = "NHIEUBANG",
    _a[TokenNames.LPAR] = "\\(",
    _a[TokenNames.RPAR] = "\\)",
    _a[TokenNames.LBRACE] = "ME",
    _a[TokenNames.RBRACE] = "MAY",
    _a[TokenNames.IF] = "NEU",
    _a[TokenNames.ELSE] = "KOTHI",
    _a[TokenNames.STRING] = "'.+'",
    _a[TokenNames.SINGLE_LINE_COMMENT] = "//.*",
    _a[TokenNames.FUNCTION] = "THE",
    _a[TokenNames.RETURN] = "TRA",
    _a[TokenNames.COMMA] = ",",
    _a);
// Automatically create a token mapping, avoiding code duplication
var tokenTypesMap = Object.freeze(Object.fromEntries(Object.entries(tokenDefinitions).map(function (_a) {
    var name = _a[0], regex = _a[1];
    return [
        name,
        createTokenType(name, regex),
    ];
})));
// List of tokens for iteration
var tokenTypesList = Object.freeze(Object.values(tokenTypesMap));
var getTokenType = function (name) { return tokenTypesMap[name]; };
// Export an object with functions for working with tokens
var useTokenType = function () { return ({
    getTokenType: getTokenType,
    tokenTypesList: tokenTypesList,
    tokenTypesMap: tokenTypesMap,
}); };
exports.useTokenType = useTokenType;
