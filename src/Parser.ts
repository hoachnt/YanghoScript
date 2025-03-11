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

	// Parse formula
	parseFormula(): ExpressionNode {
		let leftNode = this.parseParentheses();
		let operator = this.match(
			tokenTypesList.MINUS,
			tokenTypesList.PLUS,
			tokenTypesList.MULT,
			tokenTypesList.DIV,
			tokenTypesList.EQUAL,
			tokenTypesList.LESS,
			tokenTypesList.MORE,
			tokenTypesList.LESSEQ,
			tokenTypesList.MOREQ
		);
		while (operator != null) {
			let rightNode = this.parseParentheses();
			leftNode = new BinOperationNode(operator, leftNode, rightNode);
			operator = this.match(
				tokenTypesList.MINUS,
				tokenTypesList.PLUS,
				tokenTypesList.MULT,
				tokenTypesList.DIV,
				tokenTypesList.EQUAL,
				tokenTypesList.LESS,
				tokenTypesList.MORE,
				tokenTypesList.LESSEQ,
				tokenTypesList.MOREQ
			);
		}
		return leftNode;
	}

	// Parse expression
	parseExpression(): ExpressionNode {
		// Parse not variable
		if (this.match(tokenTypesList.VARIABLE) === null) {
			if (this.match(tokenTypesList.LOG) !== null) {
				// Minus 1 position because use match method
				this.pos -= 1;

				const printNode = this.parsePrint();

				return printNode;
			}
			if (this.match(tokenTypesList.IF)) {
				// Minus 1 position because use match method
				this.pos -= 1;

				return this.parseIfStatement();
			}
		}

		// Parse variable
		this.pos -= 1;
		let variableNode = this.parseVariableOrDataTypes();
		const assignOperator = this.match(tokenTypesList.ASSIGN);
		if (assignOperator != null) {
			const rightFormulaNode = this.parseFormula();
			const binaryNode = new BinOperationNode(
				assignOperator,
				variableNode,
				rightFormulaNode
			);
			return binaryNode;
		}
		throw new Error(
			`After the variable, an assignment operator is expected at position: ${this.pos}`
		);
	}

	// Parse if else
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

			// Check if the parsed expression is an if statement
			if (codeStringNode instanceof IfNode) {
				root.addNode(codeStringNode);
			} else {
				this.require(tokenTypesList.SEMICOLON); // Expecting ';'
				root.addNode(codeStringNode);
			}
		}
		return root;
	}

	parseCode(): ExpressionNode {
		return this.parseContext();
	}
}
