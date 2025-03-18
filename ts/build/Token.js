"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = void 0;
// Фабричная функция для создания токена (FP)
var createToken = function (type, text, pos) { return ({ type: type, text: text, pos: pos }); };
exports.createToken = createToken;
