"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useToken = void 0;
// Factory function for creating a token (FP)
var createToken = function (type, text, pos) { return ({
    type: type,
    text: text,
    pos: pos,
}); };
var useToken = function () { return ({
    createToken: createToken,
}); };
exports.useToken = useToken;
