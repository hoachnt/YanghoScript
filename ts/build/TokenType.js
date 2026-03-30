"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenType = exports.tokenTypesList = exports.tokenTypesMap = exports.TokenNames = void 0;
// Фабрика для создания токенов, обеспечивая чистоту функций (FP)
var createTokenType = function (name, regex) { return ({
    name: name,
    regex: regex,
}); };
// Используем enum для именования токенов, что делает код более безопасным и удобным
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
// Неизменяемая карта токенов, соблюдая принципы SOLID (отделяем данные от логики)
exports.tokenTypesMap = (_a = {},
    _a[TokenNames.NUMBER] = createTokenType(TokenNames.NUMBER, "[0-9]+"),
    _a[TokenNames.VARIABLE] = createTokenType(TokenNames.VARIABLE, "[a-z]+"),
    _a[TokenNames.SEMICOLON] = createTokenType(TokenNames.SEMICOLON, "IM"),
    _a[TokenNames.SPACE] = createTokenType(TokenNames.SPACE, "[ \n\t\r]"),
    _a[TokenNames.ASSIGN] = createTokenType(TokenNames.ASSIGN, "\\="),
    _a[TokenNames.LOG] = createTokenType(TokenNames.LOG, "NOILIENTUC"),
    _a[TokenNames.MINUS] = createTokenType(TokenNames.MINUS, "\\-"),
    _a[TokenNames.PLUS] = createTokenType(TokenNames.PLUS, "\\+"),
    _a[TokenNames.MULT] = createTokenType(TokenNames.MULT, "\\*"),
    _a[TokenNames.DIV] = createTokenType(TokenNames.DIV, "\\/"),
    _a[TokenNames.EQUAL] = createTokenType(TokenNames.EQUAL, "UYTIN"),
    _a[TokenNames.LESS] = createTokenType(TokenNames.LESS, "ITHON"),
    _a[TokenNames.MORE] = createTokenType(TokenNames.MORE, "NHIEUHON"),
    _a[TokenNames.LESSEQ] = createTokenType(TokenNames.LESSEQ, "ITBANG"),
    _a[TokenNames.MOREQ] = createTokenType(TokenNames.MOREQ, "NHIEUBANG"),
    _a[TokenNames.LPAR] = createTokenType(TokenNames.LPAR, "\\("),
    _a[TokenNames.RPAR] = createTokenType(TokenNames.RPAR, "\\)"),
    _a[TokenNames.LBRACE] = createTokenType(TokenNames.LBRACE, "ME"),
    _a[TokenNames.RBRACE] = createTokenType(TokenNames.RBRACE, "MAY"),
    _a[TokenNames.IF] = createTokenType(TokenNames.IF, "NEU"),
    _a[TokenNames.ELSE] = createTokenType(TokenNames.ELSE, "KOTHI"),
    _a[TokenNames.STRING] = createTokenType(TokenNames.STRING, "'.+'"),
    _a[TokenNames.SINGLE_LINE_COMMENT] = createTokenType(TokenNames.SINGLE_LINE_COMMENT, "//.*"),
    _a[TokenNames.FUNCTION] = createTokenType(TokenNames.FUNCTION, "THE"),
    _a[TokenNames.RETURN] = createTokenType(TokenNames.RETURN, "TRA"),
    _a[TokenNames.COMMA] = createTokenType(TokenNames.COMMA, ","),
    _a);
// Возвращаем массив токенов, если нужно итерироваться по ним
exports.tokenTypesList = Object.values(exports.tokenTypesMap);
// Функция для получения токена по имени
var getTokenType = function (name) { return exports.tokenTypesMap[name]; };
exports.getTokenType = getTokenType;
