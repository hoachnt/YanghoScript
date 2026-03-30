"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var BinOperationNode_1 = __importDefault(require("../AST/BinOperationNode"));
var FunctionCallNode_1 = __importDefault(require("../AST/FunctionCallNode"));
var FunctionDeclarationNode_1 = __importDefault(require("../AST/FunctionDeclarationNode"));
var IfNode_1 = __importDefault(require("../AST/IfNode"));
var NumberNode_1 = __importDefault(require("../AST/NumberNode"));
var ReturnNode_1 = __importDefault(require("../AST/ReturnNode"));
var StatementsNode_1 = __importDefault(require("../AST/StatementsNode"));
var StringNode_1 = __importDefault(require("../AST/StringNode"));
var UnarOperationNode_1 = __importDefault(require("../AST/UnarOperationNode"));
var VariableNode_1 = __importDefault(require("../AST/VariableNode"));
var tokens_1 = require("../tokens");
var ReturnException = /** @class */ (function () {
    function ReturnException(value) {
        this.value = value;
    }
    return ReturnException;
}());
function evaluate(node, env) {
    var _a, _b;
    var getTokenType = (0, tokens_1.useTokenType)().getTokenType;
    if (node instanceof ReturnNode_1.default) {
        var result = evaluate(node.expression, env);
        throw new ReturnException(result.value);
    }
    // Function declaration: extend the functions map.
    if (node instanceof FunctionDeclarationNode_1.default) {
        return {
            value: undefined,
            env: {
                scope: __assign({}, env.scope),
                functions: __assign(__assign({}, env.functions), (_a = {}, _a[node.name.text] = node, _a)),
            },
        };
    }
    // Function call: evaluate arguments, create a local scope and call the function body.
    if (node instanceof FunctionCallNode_1.default) {
        var func = env.functions[node.name.text];
        if (!func) {
            throw new Error("Function '".concat(node.name.text, "' not found"));
        }
        var interimEnv_1 = env;
        var args_1 = node.args.map(function (arg) {
            var res = evaluate(arg, interimEnv_1);
            interimEnv_1 = res.env;
            return res.value;
        });
        var localScope_1 = __assign({}, env.scope);
        func.params.forEach(function (param, index) {
            localScope_1[param.text] = args_1[index];
        });
        var funcEnv = {
            scope: localScope_1,
            functions: env.functions,
        };
        try {
            var result = evaluate(func.body, funcEnv);
            return { value: result.value, env: env };
        }
        catch (err) {
            if (err instanceof ReturnException) {
                return { value: err.value, env: env };
            }
            throw err;
        }
    }
    // If statement: evaluate condition and then one of the branches.
    if (node instanceof IfNode_1.default) {
        var conditionRes = evaluate(node.condition, env);
        if (conditionRes.value) {
            return evaluate(node.trueBlock, conditionRes.env);
        }
        else if (node.falseBlock) {
            return evaluate(node.falseBlock, conditionRes.env);
        }
        else {
            return { value: undefined, env: conditionRes.env };
        }
    }
    // Numeric literal.
    if (node instanceof NumberNode_1.default) {
        return { value: parseInt(node.number.text), env: env };
    }
    // String literal.
    if (node instanceof StringNode_1.default) {
        return { value: node.string.text.replace(/'/g, ""), env: env };
    }
    // Unary operation.
    if (node instanceof UnarOperationNode_1.default) {
        if (node.operator.type.name === getTokenType(tokens_1.TokenNames.LOG).name) {
            var operandRes = evaluate(node.operand, env);
            console.log(operandRes.value);
            return { value: undefined, env: operandRes.env };
        }
    }
    // Binary operations.
    if (node instanceof BinOperationNode_1.default) {
        switch (node.operator.type.name) {
            case getTokenType(tokens_1.TokenNames.PLUS).name: {
                var left = evaluate(node.leftNode, env);
                var right = evaluate(node.rightNode, left.env);
                return { value: left.value + right.value, env: right.env };
            }
            case getTokenType(tokens_1.TokenNames.MINUS).name: {
                var left = evaluate(node.leftNode, env);
                var right = evaluate(node.rightNode, left.env);
                return { value: left.value - right.value, env: right.env };
            }
            case getTokenType(tokens_1.TokenNames.MULT).name: {
                var left = evaluate(node.leftNode, env);
                var right = evaluate(node.rightNode, left.env);
                return { value: left.value * right.value, env: right.env };
            }
            case getTokenType(tokens_1.TokenNames.DIV).name: {
                var left = evaluate(node.leftNode, env);
                var right = evaluate(node.rightNode, left.env);
                return { value: left.value / right.value, env: right.env };
            }
            case getTokenType(tokens_1.TokenNames.EQUAL).name: {
                var left = evaluate(node.leftNode, env);
                var right = evaluate(node.rightNode, left.env);
                return { value: left.value == right.value, env: right.env };
            }
            case getTokenType(tokens_1.TokenNames.LESS).name: {
                var left = evaluate(node.leftNode, env);
                var right = evaluate(node.rightNode, left.env);
                return { value: left.value < right.value, env: right.env };
            }
            case getTokenType(tokens_1.TokenNames.MORE).name: {
                var left = evaluate(node.leftNode, env);
                var right = evaluate(node.rightNode, left.env);
                return { value: left.value > right.value, env: right.env };
            }
            case getTokenType(tokens_1.TokenNames.LESSEQ).name: {
                var left = evaluate(node.leftNode, env);
                var right = evaluate(node.rightNode, left.env);
                return { value: left.value <= right.value, env: right.env };
            }
            case getTokenType(tokens_1.TokenNames.MOREQ).name: {
                var left = evaluate(node.leftNode, env);
                var right = evaluate(node.rightNode, left.env);
                return { value: left.value >= right.value, env: right.env };
            }
            case getTokenType(tokens_1.TokenNames.ASSIGN).name: {
                var rightRes = evaluate(node.rightNode, env);
                if (!(node.leftNode instanceof VariableNode_1.default)) {
                    throw new Error("Left node of assignment must be a variable");
                }
                var varName = node.leftNode.variable.text;
                var newScope = __assign(__assign({}, env.scope), (_b = {}, _b[varName] = rightRes.value, _b));
                return {
                    value: rightRes.value,
                    env: { scope: newScope, functions: env.functions },
                };
            }
            default:
                throw new Error("Unknown binary operator");
        }
    }
    // Variable access.
    if (node instanceof VariableNode_1.default) {
        var varName = node.variable.text;
        if (env.scope.hasOwnProperty(varName)) {
            return { value: env.scope[varName], env: env };
        }
        else {
            throw new Error("Variable '".concat(varName, "' not found"));
        }
    }
    // Statements: evaluate each statement sequentially, threading the updated environment.
    if (node instanceof StatementsNode_1.default) {
        var currentEnv = env;
        var lastValue = undefined;
        for (var _i = 0, _c = node.codeStrings; _i < _c.length; _i++) {
            var statement = _c[_i];
            var res = evaluate(statement, currentEnv);
            lastValue = res.value;
            currentEnv = res.env;
        }
        return { value: lastValue, env: currentEnv };
    }
    throw new Error("Unknown node type encountered!");
}
var Interpreter = /** @class */ (function () {
    function Interpreter() {
        this.env = { scope: {}, functions: {} };
    }
    Interpreter.prototype.run = function (node) {
        try {
            var result = evaluate(node, this.env);
            this.env = result.env;
            return result.value;
        }
        catch (err) {
            if (err instanceof ReturnException) {
                // If a return is encountered at the top level, simply return its value.
                return err.value;
            }
            throw err;
        }
    };
    return Interpreter;
}());
exports.default = Interpreter;
