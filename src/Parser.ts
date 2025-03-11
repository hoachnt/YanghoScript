import Token from "./Token";
import TokenType, { tokenTypesList } from "./TokenType";
import ExpressionNode from "./AST/ExpressionNode";
import StatementsNode from "./AST/StatementsNode";
import NumberNode from "./AST/NumberNode";
import VariableNode from "./AST/VariableNode";
import BinOperationNode from "./AST/BinOperationNode";
import UnarOperationNode from "./AST/UnarOperationNode";
import StringNode from "./AST/StringNode";
import IfNode from "./AST/IfNode";
import FunctionDeclarationNode from "./AST/FunctionDeclarationNode";
import FunctionCallNode from "./AST/FunctionCallNode";
import ReturnNode from "./AST/ReturnNode";

export default class Parser {
	tokens: Token[];
	pos: number = 0;

	constructor(tokens: Token[]) {
		this.tokens = tokens;
	}

	// Method to match tokens
	match(...expected: TokenType[]): Token | null {
		if (this.pos < this.tokens.length) {
			const currentToken = this.tokens[this.pos];
			if (expected.find((type) => type.name === currentToken.type.name)) {
				this.pos += 1;
				return currentToken;
			}
		}
		return null;
	}

	// Method to require tokens
	require(...expected: TokenType[]): Token {
		const token = this.match(...expected);
		if (!token) {
			throw new Error(
				`Expected ${expected
					.map((t) => t.name)
					.join(" or ")} at position: ${this.pos}`
			);
		}
		return token;
	}

	// Parse variable or data types
	parseVariableOrDataTypes(): ExpressionNode {
		const number = this.match(tokenTypesList.NUMBER);
		if (number != null) {
			return new NumberNode(number);
		}
		const variable = this.match(tokenTypesList.VARIABLE);
		if (variable != null) {
			// Проверка на вызов функции
			if (this.match(tokenTypesList.LPAR) != null) {
				this.pos -= 1;
				return this.parseFunctionCall(variable);
			}
			return new VariableNode(variable);
		}
		const string = this.match(tokenTypesList.STRING);
		if (string != null) {
			return new StringNode(string);
		}
		throw new Error(
			`Expecting a variable, number, or string at position: ${this.pos}`
		);
	}

	// Parse print statement
	parsePrint(): ExpressionNode {
		const operatorLog = this.match(tokenTypesList.LOG);
		if (operatorLog != null) {
			return new UnarOperationNode(operatorLog, this.parseFormula());
		}
		throw new Error(`Expecting a unary operator at position: ${this.pos}`);
	}

	// Parse parentheses
	parseParentheses(): ExpressionNode {
		if (this.match(tokenTypesList.LPAR) != null) {
			const node = this.parseFormula();
			this.require(tokenTypesList.RPAR);

			return node;
		} else {
			return this.parseVariableOrDataTypes();
		}
	}

	// Parse braces
	parseBraces(): ExpressionNode {
		if (this.match(tokenTypesList.LBRACE) != null) {
			const node = this.parseContext();

			this.pos -= 1;

			this.require(tokenTypesList.RBRACE);
			return node;
		} else {
			throw new Error(`Expecting { at position: ${this.pos}`);
		}
	}

	// New helper: parses parenthesized expressions or basic data types
	parsePrimary(): ExpressionNode {
		if (this.match(tokenTypesList.LPAR) != null) {
			const node = this.parseFormula(); // later levels handle operations
			this.require(tokenTypesList.RPAR);
			return node;
		}
		return this.parseVariableOrDataTypes();
	}

	// New helper: handles multiplication and division operators
	parseMultiplicative(): ExpressionNode {
		let node = this.parsePrimary();
		let operator = this.match(tokenTypesList.MULT, tokenTypesList.DIV);
		while (operator != null) {
			const rightNode = this.parsePrimary();
			node = new BinOperationNode(operator, node, rightNode);
			operator = this.match(tokenTypesList.MULT, tokenTypesList.DIV);
		}
		return node;
	}

	// New helper: handles addition and subtraction operators
	parseAdditive(): ExpressionNode {
		let node = this.parseMultiplicative();
		let operator = this.match(tokenTypesList.PLUS, tokenTypesList.MINUS);
		while (operator != null) {
			const rightNode = this.parseMultiplicative();
			node = new BinOperationNode(operator, node, rightNode);
			operator = this.match(tokenTypesList.PLUS, tokenTypesList.MINUS);
		}
		return node;
	}

	// New helper: handles comparisons (=, <, >, etc.)
	parseComparison(): ExpressionNode {
		let node = this.parseAdditive();
		let operator = this.match(
			tokenTypesList.EQUAL,
			tokenTypesList.LESS,
			tokenTypesList.MORE,
			tokenTypesList.LESSEQ,
			tokenTypesList.MOREQ
		);
		while (operator != null) {
			const rightNode = this.parseAdditive();
			node = new BinOperationNode(operator, node, rightNode);
			operator = this.match(
				tokenTypesList.EQUAL,
				tokenTypesList.LESS,
				tokenTypesList.MORE,
				tokenTypesList.LESSEQ,
				tokenTypesList.MOREQ
			);
		}
		return node;
	}

	// Update parseFormula() to start with comparisons (the top arithmetic level)
	parseFormula(): ExpressionNode {
		return this.parseComparison();
	}

	// Parse function declaration
	parseFunctionDeclaration(): ExpressionNode {
		this.require(tokenTypesList.FUNCTION); // Expecting 'HAM'
		const name = this.require(tokenTypesList.VARIABLE); // Function name
		this.require(tokenTypesList.LPAR); // Expecting '('

		const params: Token[] = [];
		if (this.match(tokenTypesList.RPAR) == null) {
			do {
				params.push(this.require(tokenTypesList.VARIABLE));
			} while (this.match(tokenTypesList.COMMA) != null);
			this.require(tokenTypesList.RPAR); // Expecting ')'
		}

		const body = this.parseBraces() as StatementsNode; // Function body

		return new FunctionDeclarationNode(name, params, body);
	}

	// Parse function call
	parseFunctionCall(name: Token): ExpressionNode {
		this.require(tokenTypesList.LPAR); // Expecting '('

		const args: ExpressionNode[] = [];
		if (this.match(tokenTypesList.RPAR) == null) {
			do {
				args.push(this.parseFormula());
			} while (this.match(tokenTypesList.COMMA) != null);
			this.require(tokenTypesList.RPAR); // Expecting ')'
		}

		return new FunctionCallNode(name, args);
	}

	// Parse return statement
	parseReturn(): ExpressionNode {
		// Already matched the 'RETURN' token in parseExpression.
		const token = this.require(tokenTypesList.RETURN);
		const expr = this.parseFormula();
		// Optionally require a semicolon if needed:
		this.require(tokenTypesList.SEMICOLON);
		return new ReturnNode(expr);
	}

	// Parse expressions
	parseExpression(): ExpressionNode {
		const currentToken = this.tokens[this.pos];
		if (currentToken.type.name === tokenTypesList.FUNCTION.name) {
			return this.parseFunctionDeclaration();
		}
		if (currentToken.type.name === tokenTypesList.RETURN.name) {
			return this.parseReturn();
		}

		// Other checks
		if (this.match(tokenTypesList.VARIABLE) === null) {
			if (this.match(tokenTypesList.LOG) !== null) {
				this.pos -= 1;
				return this.parsePrint();
			}
			if (this.match(tokenTypesList.IF)) {
				this.pos -= 1;
				return this.parseIfStatement();
			}
		}

		this.pos -= 1;
		let variableNode = this.parseVariableOrDataTypes();
		const assignOperator = this.match(tokenTypesList.ASSIGN);
		if (assignOperator != null) {
			const rightFormulaNode = this.parseFormula();
			return new BinOperationNode(
				assignOperator,
				variableNode,
				rightFormulaNode
			);
		}

		return variableNode;
	}

	// Parse if-else statement
	parseIfStatement(): ExpressionNode {
		this.require(tokenTypesList.IF); // Expecting 'NEU'
		const condition = this.parseFormula(); // Parsing the condition

		// Ensure that we expect a left curly brace
		if (this.match(tokenTypesList.LBRACE) === null) {
			throw new Error(`Expected '{' at position: ${this.pos}`);
		}

		const trueBlock = this.parseContext(); // Parsing the true block

		// Move back one position because parseContext uses the match method to check for RBRACE
		this.pos -= 1;

		this.require(tokenTypesList.RBRACE); // Expecting '}'

		let falseBlock: ExpressionNode | null = null; // Initializing the false block
		if (this.match(tokenTypesList.ELSE) !== null) {
			// Checking for 'KO THI'
			if (this.match(tokenTypesList.IF) !== null) {
				// If 'else if' exists
				this.pos -= 1; // Move back one position because we use the match method
				falseBlock = this.parseIfStatement(); // Recursively parse else if
			} else {
				if (this.match(tokenTypesList.LBRACE) === null) {
					throw new Error(`Expected '{' at position: ${this.pos}`);
				}
				falseBlock = this.parseContext(); // Parsing the false block

				// Move back one position because parseContext uses the match method to check for RBRACE
				this.pos -= 1;

				this.require(tokenTypesList.RBRACE); // Expecting '}'
			}
		}

		return new IfNode(condition, trueBlock, falseBlock); // Creating IfNode
	}

	// Parse context
	parseContext(): ExpressionNode {
		const root = new StatementsNode();

		while (this.pos < this.tokens.length) {
			if (this.match(tokenTypesList.RBRACE) !== null) break;

			const codeStringNode = this.parseExpression();

			// If the expression is an IF construct, function declaration, or return,
			// a semicolon is not required.
			if (
				codeStringNode instanceof IfNode ||
				codeStringNode instanceof FunctionDeclarationNode ||
				codeStringNode instanceof ReturnNode
			) {
				root.addNode(codeStringNode);
			} else {
				this.require(tokenTypesList.SEMICOLON); // Otherwise, expect ';'
				root.addNode(codeStringNode);
			}
		}
		return root;
	}

	parseCode(): ExpressionNode {
		return this.parseContext();
	}
}
