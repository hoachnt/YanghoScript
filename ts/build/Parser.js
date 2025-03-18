"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var TokenType_1 = require("./tokens/TokenType");
var StatementsNode_1 = __importDefault(require("./AST/StatementsNode"));
var NumberNode_1 = __importDefault(require("./AST/NumberNode"));
var VariableNode_1 = __importDefault(require("./AST/VariableNode"));
var BinOperationNode_1 = __importDefault(require("./AST/BinOperationNode"));
var UnarOperationNode_1 = __importDefault(require("./AST/UnarOperationNode"));
var StringNode_1 = __importDefault(require("./AST/StringNode"));
var IfNode_1 = __importDefault(require("./AST/IfNode"));
var FunctionDeclarationNode_1 = __importDefault(require("./AST/FunctionDeclarationNode"));
var FunctionCallNode_1 = __importDefault(require("./AST/FunctionCallNode"));
var ReturnNode_1 = __importDefault(require("./AST/ReturnNode"));
var Parser = /** @class */ (function () {
    function Parser(tokens, source) {
        this.pos = 0;
        var getTokenType = (0, TokenType_1.useTokenType)().getTokenType;
        // <-- update constructor signature
        this.tokens = tokens;
        this.source = source;
        this.getTokenType = getTokenType;
    }
    // New helper to compute error details with column info
    Parser.prototype.getErrorDetails = function (pos) {
        // Adjust pos by subtracting one to correctly report the line
        var adjustedPos = pos > 0 ? pos - 1 : pos;
        var lines = this.source.split("\n");
        var currentPos = 0;
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (currentPos + line.length >= adjustedPos) {
                var column = adjustedPos - currentPos;
                return ("Line ".concat(i + 1, ", Column ").concat(column, ": ").concat(line, "\n") +
                    "".concat(" ".repeat(column), "^"));
            }
            currentPos += line.length + 1; // include newline
        }
        return "Unknown location";
    };
    // Method to match tokens
    Parser.prototype.match = function () {
        var expected = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            expected[_i] = arguments[_i];
        }
        if (this.pos < this.tokens.length) {
            var currentToken_1 = this.tokens[this.pos];
            if (expected.find(function (type) { return type.name === currentToken_1.type.name; })) {
                this.pos += 1;
                return currentToken_1;
            }
        }
        return null;
    };
    // Updated require() that shows error details including the token that came before the failure.
    Parser.prototype.require = function () {
        var _a;
        var expected = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            expected[_i] = arguments[_i];
        }
        var token = this.match.apply(this, expected);
        if (!token) {
            var tokenPos = ((_a = this.tokens[this.pos]) === null || _a === void 0 ? void 0 : _a.pos) || 0;
            var errorDetails = this.getErrorDetails(tokenPos);
            // If possible, show the text of the previous token
            var prevText = this.pos > 0 ? this.tokens[this.pos - 1].text : "";
            throw new Error("Syntax Error at ".concat(errorDetails, " - Expected ").concat(expected
                .map(function (t) { return t.name; })
                .join(" or "), " after '").concat(prevText, "'."));
        }
        return token;
    };
    // Parse variable or data types
    Parser.prototype.parseVariableOrDataTypes = function () {
        var number = this.match(this.getTokenType(TokenType_1.TokenNames.NUMBER));
        if (number != null) {
            return new NumberNode_1.default(number);
        }
        var variable = this.match(this.getTokenType(TokenType_1.TokenNames.VARIABLE));
        if (variable != null) {
            // Проверка на вызов функции
            if (this.match(this.getTokenType(TokenType_1.TokenNames.LPAR)) != null) {
                this.pos -= 1;
                return this.parseFunctionCall(variable);
            }
            return new VariableNode_1.default(variable);
        }
        var string = this.match(this.getTokenType(TokenType_1.TokenNames.STRING));
        if (string != null) {
            return new StringNode_1.default(string);
        }
        throw new Error("Expecting a variable, number, or string at position: ".concat(this.pos));
    };
    // Parse print statement
    Parser.prototype.parsePrint = function () {
        var operatorLog = this.match(this.getTokenType(TokenType_1.TokenNames.LOG));
        if (operatorLog != null) {
            return new UnarOperationNode_1.default(operatorLog, this.parseFormula());
        }
        throw new Error("Expecting a unary operator at position: ".concat(this.pos));
    };
    // Parse parentheses
    Parser.prototype.parseParentheses = function () {
        if (this.match(this.getTokenType(TokenType_1.TokenNames.LPAR)) != null) {
            var node = this.parseFormula();
            this.require(this.getTokenType(TokenType_1.TokenNames.RPAR));
            return node;
        }
        else {
            return this.parseVariableOrDataTypes();
        }
    };
    // Parse braces
    Parser.prototype.parseBraces = function () {
        if (this.match(this.getTokenType(TokenType_1.TokenNames.LBRACE)) != null) {
            var node = this.parseContext();
            this.pos -= 1;
            this.require(this.getTokenType(TokenType_1.TokenNames.RBRACE));
            return node;
        }
        else {
            throw new Error("Expecting { at position: ".concat(this.pos));
        }
    };
    // New helper: parses parenthesized expressions or basic data types
    Parser.prototype.parsePrimary = function () {
        if (this.match(this.getTokenType(TokenType_1.TokenNames.LPAR)) != null) {
            var node = this.parseFormula(); // later levels handle operations
            this.require(this.getTokenType(TokenType_1.TokenNames.RPAR));
            return node;
        }
        return this.parseVariableOrDataTypes();
    };
    // New helper: handles multiplication and division operators
    Parser.prototype.parseMultiplicative = function () {
        var node = this.parsePrimary();
        var operator = this.match(this.getTokenType(TokenType_1.TokenNames.MULT), this.getTokenType(TokenType_1.TokenNames.DIV));
        while (operator != null) {
            var rightNode = this.parsePrimary();
            node = new BinOperationNode_1.default(operator, node, rightNode);
            operator = this.match(this.getTokenType(TokenType_1.TokenNames.MULT), this.getTokenType(TokenType_1.TokenNames.DIV));
        }
        return node;
    };
    // New helper: handles addition and subtraction operators
    Parser.prototype.parseAdditive = function () {
        var node = this.parseMultiplicative();
        var operator = this.match(this.getTokenType(TokenType_1.TokenNames.PLUS), this.getTokenType(TokenType_1.TokenNames.MINUS));
        while (operator != null) {
            var rightNode = this.parseMultiplicative();
            node = new BinOperationNode_1.default(operator, node, rightNode);
            operator = this.match(this.getTokenType(TokenType_1.TokenNames.PLUS), this.getTokenType(TokenType_1.TokenNames.MINUS));
        }
        return node;
    };
    // New helper: handles comparisons (=, <, >, etc.)
    Parser.prototype.parseComparison = function () {
        var node = this.parseAdditive();
        var operator = this.match(this.getTokenType(TokenType_1.TokenNames.EQUAL), this.getTokenType(TokenType_1.TokenNames.LESS), this.getTokenType(TokenType_1.TokenNames.MORE), this.getTokenType(TokenType_1.TokenNames.LESSEQ), this.getTokenType(TokenType_1.TokenNames.MOREQ));
        while (operator != null) {
            var rightNode = this.parseAdditive();
            node = new BinOperationNode_1.default(operator, node, rightNode);
            operator = this.match(this.getTokenType(TokenType_1.TokenNames.EQUAL), this.getTokenType(TokenType_1.TokenNames.LESS), this.getTokenType(TokenType_1.TokenNames.MORE), this.getTokenType(TokenType_1.TokenNames.LESSEQ), this.getTokenType(TokenType_1.TokenNames.MOREQ));
        }
        return node;
    };
    // Update parseFormula() to start with comparisons (the top arithmetic level)
    Parser.prototype.parseFormula = function () {
        return this.parseComparison();
    };
    // Parse function declaration
    Parser.prototype.parseFunctionDeclaration = function () {
        this.require(this.getTokenType(TokenType_1.TokenNames.FUNCTION)); // Expecting 'HAM'
        var name = this.require(this.getTokenType(TokenType_1.TokenNames.VARIABLE)); // Function name
        this.require(this.getTokenType(TokenType_1.TokenNames.LPAR)); // Expecting '('
        var params = [];
        if (this.match(this.getTokenType(TokenType_1.TokenNames.RPAR)) == null) {
            do {
                params.push(this.require(this.getTokenType(TokenType_1.TokenNames.VARIABLE)));
            } while (this.match(this.getTokenType(TokenType_1.TokenNames.COMMA)) != null);
            this.require(this.getTokenType(TokenType_1.TokenNames.RPAR)); // Expecting ')'
        }
        var body = this.parseBraces(); // Function body
        return new FunctionDeclarationNode_1.default(name, params, body);
    };
    // Parse function call
    Parser.prototype.parseFunctionCall = function (name) {
        this.require(this.getTokenType(TokenType_1.TokenNames.LPAR)); // Expecting '('
        var args = [];
        if (this.match(this.getTokenType(TokenType_1.TokenNames.RPAR)) == null) {
            do {
                args.push(this.parseFormula());
            } while (this.match(this.getTokenType(TokenType_1.TokenNames.COMMA)) != null);
            this.require(this.getTokenType(TokenType_1.TokenNames.RPAR)); // Expecting ')'
        }
        return new FunctionCallNode_1.default(name, args);
    };
    // Parse return statement
    Parser.prototype.parseReturn = function () {
        // Already matched the 'RETURN' token in parseExpression.
        var token = this.require(this.getTokenType(TokenType_1.TokenNames.RETURN));
        var expr = this.parseFormula();
        // Optionally require a semicolon if needed:
        this.require(this.getTokenType(TokenType_1.TokenNames.SEMICOLON));
        return new ReturnNode_1.default(expr);
    };
    // Parse expressions
    Parser.prototype.parseExpression = function () {
        var currentToken = this.tokens[this.pos];
        if (currentToken.type.name ===
            this.getTokenType(TokenType_1.TokenNames.FUNCTION).name) {
            return this.parseFunctionDeclaration();
        }
        if (currentToken.type.name === this.getTokenType(TokenType_1.TokenNames.RETURN).name) {
            return this.parseReturn();
        }
        // Other checks
        if (this.match(this.getTokenType(TokenType_1.TokenNames.VARIABLE)) === null) {
            if (this.match(this.getTokenType(TokenType_1.TokenNames.LOG)) !== null) {
                this.pos -= 1;
                return this.parsePrint();
            }
            if (this.match(this.getTokenType(TokenType_1.TokenNames.IF))) {
                this.pos -= 1;
                return this.parseIfStatement();
            }
        }
        this.pos -= 1;
        var variableNode = this.parseVariableOrDataTypes();
        var assignOperator = this.match(this.getTokenType(TokenType_1.TokenNames.ASSIGN));
        if (assignOperator != null) {
            var rightFormulaNode = this.parseFormula();
            return new BinOperationNode_1.default(assignOperator, variableNode, rightFormulaNode);
        }
        return variableNode;
    };
    // Parse if-else statement
    Parser.prototype.parseIfStatement = function () {
        this.require(this.getTokenType(TokenType_1.TokenNames.IF)); // Expecting 'NEU'
        var condition = this.parseFormula(); // Parsing the condition
        // Ensure that we expect a left curly brace
        if (this.match(this.getTokenType(TokenType_1.TokenNames.LBRACE)) === null) {
            throw new Error("Expected '{' at position: ".concat(this.pos));
        }
        var trueBlock = this.parseContext(); // Parsing the true block
        // Move back one position because parseContext uses the match method to check for RBRACE
        this.pos -= 1;
        this.require(this.getTokenType(TokenType_1.TokenNames.RBRACE)); // Expecting '}'
        var falseBlock = null; // Initializing the false block
        if (this.match(this.getTokenType(TokenType_1.TokenNames.ELSE)) !== null) {
            // Checking for 'KO THI'
            if (this.match(this.getTokenType(TokenType_1.TokenNames.IF)) !== null) {
                // If 'else if' exists
                this.pos -= 1; // Move back one position because we use the match method
                falseBlock = this.parseIfStatement(); // Recursively parse else if
            }
            else {
                if (this.match(this.getTokenType(TokenType_1.TokenNames.LBRACE)) === null) {
                    throw new Error("Expected '{' at position: ".concat(this.pos));
                }
                falseBlock = this.parseContext(); // Parsing the false block
                // Move back one position because parseContext uses the match method to check for RBRACE
                this.pos -= 1;
                this.require(this.getTokenType(TokenType_1.TokenNames.RBRACE)); // Expecting '}'
            }
        }
        return new IfNode_1.default(condition, trueBlock, falseBlock); // Creating IfNode
    };
    // Parse context
    Parser.prototype.parseContext = function () {
        var root = new StatementsNode_1.default();
        while (this.pos < this.tokens.length) {
            if (this.match(this.getTokenType(TokenType_1.TokenNames.RBRACE)) !== null)
                break;
            var codeStringNode = this.parseExpression();
            // If the expression is an IF construct, function declaration, or return,
            // a semicolon is not required.
            if (codeStringNode instanceof IfNode_1.default ||
                codeStringNode instanceof FunctionDeclarationNode_1.default ||
                codeStringNode instanceof ReturnNode_1.default) {
                root.addNode(codeStringNode);
            }
            else {
                this.require(this.getTokenType(TokenType_1.TokenNames.SEMICOLON)); // Otherwise, expect ';'
                root.addNode(codeStringNode);
            }
        }
        return root;
    };
    Parser.prototype.parseCode = function () {
        return this.parseContext();
    };
    return Parser;
}());
exports.default = Parser;
