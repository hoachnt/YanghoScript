"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLexer = void 0;
var tokens_1 = require("./tokens");
var createLexer = function (code, dependencies) {
    var createToken = dependencies.createToken, tokenTypesList = dependencies.tokenTypesList, tokenTypesMap = dependencies.tokenTypesMap;
    var compiledRegexList = tokenTypesList.map(function (_a) {
        var name = _a.name, regex = _a.regex;
        return ({
            name: name,
            regex: new RegExp("^".concat(regex)),
        });
    });
    var skipSingleLineComment = function (pos) {
        return code.indexOf("\n", pos) + 1 || code.length;
    };
    var skipMultiLineComment = function (pos) {
        var endPos = code.indexOf("*/", pos + 2);
        return endPos === -1 ? code.length : endPos + 2;
    };
    var matchToken = function (pos) {
        var slice = code.slice(pos);
        return compiledRegexList.reduce(function (found, _a) {
            var name = _a.name, regex = _a.regex;
            if (found)
                return found;
            var match = slice.match(regex);
            return match
                ? createToken(tokenTypesMap[name], match[0], pos)
                : null;
        }, null);
    };
    var getNextToken = function (pos) {
        if (pos >= code.length)
            return [pos, null];
        if (code.startsWith("//", pos))
            return [skipSingleLineComment(pos), null];
        if (code.startsWith("/*", pos))
            return [skipMultiLineComment(pos), null];
        var token = matchToken(pos);
        return token ? [pos + token.text.length, token] : [pos, null];
    };
    var lexAnalysis = function () {
        var processTokens = function (pos, tokens) {
            if (pos >= code.length)
                return tokens;
            var _a = getNextToken(pos), newPos = _a[0], token = _a[1];
            return processTokens(newPos, token && token.type !== tokenTypesMap[tokens_1.TokenNames.SPACE]
                ? __spreadArray(__spreadArray([], tokens, true), [token], false) : tokens);
        };
        return processTokens(0, []);
    };
    return { lexAnalysis: lexAnalysis };
};
exports.createLexer = createLexer;
