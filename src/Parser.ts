import { Token } from "./tokens";
import { TokenType, useTokenType } from "./tokens/TokenType";
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
	source: string; // <-- add source to hold code text
	private getTokenType;
	private TokenNames;

	constructor(tokens: Token[], source: string) {
		const { getTokenType, TokenNames, tokenTypesList } = useTokenType();

		// <-- update constructor signature
		this.tokens = tokens;
		this.source = source;
		this.getTokenType = getTokenType;
		this.TokenNames = TokenNames;
	}

	// New helper to compute error details with column info
	private getErrorDetails(pos: number): string {
		// Adjust pos by subtracting one to correctly report the line
		const adjustedPos = pos > 0 ? pos - 1 : pos;
		const lines = this.source.split("\n");
		let currentPos = 0;
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			if (currentPos + line.length >= adjustedPos) {
				const column = adjustedPos - currentPos;
				return (
					`Line ${i + 1}, Column ${column}: ${line}\n` +
					`${" ".repeat(column)}^`
				);
			}
			currentPos += line.length + 1; // include newline
		}
		return "Unknown location";
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

	// Updated require() that shows error details including the token that came before the failure.
	require(...expected: TokenType[]): Token {
		const token = this.match(...expected);
		if (!token) {
			const tokenPos = this.tokens[this.pos]?.pos || 0;
			const errorDetails = this.getErrorDetails(tokenPos);
			// If possible, show the text of the previous token
			const prevText = this.pos > 0 ? this.tokens[this.pos - 1].text : "";
			throw new Error(
				`Syntax Error at ${errorDetails} - Expected ${expected
					.map((t) => t.name)
					.join(" or ")} after '${prevText}'.`
			);
		}
		return token;
	}

	// Parse variable or data types
	parseVariableOrDataTypes(): ExpressionNode {
		const number = this.match(this.getTokenType(this.TokenNames.NUMBER));
		if (number != null) {
			return new NumberNode(number);
		}
		const variable = this.match(
			this.getTokenType(this.TokenNames.VARIABLE)
		);
		if (variable != null) {
			// Проверка на вызов функции
			if (this.match(this.getTokenType(this.TokenNames.LPAR)) != null) {
				this.pos -= 1;
				return this.parseFunctionCall(variable);
			}
			return new VariableNode(variable);
		}
		const string = this.match(this.getTokenType(this.TokenNames.STRING));
		if (string != null) {
			return new StringNode(string);
		}
		throw new Error(
			`Expecting a variable, number, or string at position: ${this.pos}`
		);
	}

	// Parse print statement
	parsePrint(): ExpressionNode {
		const operatorLog = this.match(this.getTokenType(this.TokenNames.LOG));
		if (operatorLog != null) {
			return new UnarOperationNode(operatorLog, this.parseFormula());
		}
		throw new Error(`Expecting a unary operator at position: ${this.pos}`);
	}

	// Parse parentheses
	parseParentheses(): ExpressionNode {
		if (this.match(this.getTokenType(this.TokenNames.LPAR)) != null) {
			const node = this.parseFormula();
			this.require(this.getTokenType(this.TokenNames.RPAR));

			return node;
		} else {
			return this.parseVariableOrDataTypes();
		}
	}

	// Parse braces
	parseBraces(): ExpressionNode {
		if (this.match(this.getTokenType(this.TokenNames.LBRACE)) != null) {
			const node = this.parseContext();

			this.pos -= 1;

			this.require(this.getTokenType(this.TokenNames.RBRACE));
			return node;
		} else {
			throw new Error(`Expecting { at position: ${this.pos}`);
		}
	}

	// New helper: parses parenthesized expressions or basic data types
	parsePrimary(): ExpressionNode {
		if (this.match(this.getTokenType(this.TokenNames.LPAR)) != null) {
			const node = this.parseFormula(); // later levels handle operations
			this.require(this.getTokenType(this.TokenNames.RPAR));
			return node;
		}
		return this.parseVariableOrDataTypes();
	}

	// New helper: handles multiplication and division operators
	parseMultiplicative(): ExpressionNode {
		let node = this.parsePrimary();
		let operator = this.match(
			this.getTokenType(this.TokenNames.MULT),
			this.getTokenType(this.TokenNames.DIV)
		);
		while (operator != null) {
			const rightNode = this.parsePrimary();
			node = new BinOperationNode(operator, node, rightNode);
			operator = this.match(
				this.getTokenType(this.TokenNames.MULT),
				this.getTokenType(this.TokenNames.DIV)
			);
		}
		return node;
	}

	// New helper: handles addition and subtraction operators
	parseAdditive(): ExpressionNode {
		let node = this.parseMultiplicative();
		let operator = this.match(
			this.getTokenType(this.TokenNames.PLUS),
			this.getTokenType(this.TokenNames.MINUS)
		);
		while (operator != null) {
			const rightNode = this.parseMultiplicative();
			node = new BinOperationNode(operator, node, rightNode);
			operator = this.match(
				this.getTokenType(this.TokenNames.PLUS),
				this.getTokenType(this.TokenNames.MINUS)
			);
		}
		return node;
	}

	// New helper: handles comparisons (=, <, >, etc.)
	parseComparison(): ExpressionNode {
		let node = this.parseAdditive();
		let operator = this.match(
			this.getTokenType(this.TokenNames.EQUAL),
			this.getTokenType(this.TokenNames.LESS),
			this.getTokenType(this.TokenNames.MORE),
			this.getTokenType(this.TokenNames.LESSEQ),
			this.getTokenType(this.TokenNames.MOREQ)
		);
		while (operator != null) {
			const rightNode = this.parseAdditive();
			node = new BinOperationNode(operator, node, rightNode);
			operator = this.match(
				this.getTokenType(this.TokenNames.EQUAL),
				this.getTokenType(this.TokenNames.LESS),
				this.getTokenType(this.TokenNames.MORE),
				this.getTokenType(this.TokenNames.LESSEQ),
				this.getTokenType(this.TokenNames.MOREQ)
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
		this.require(this.getTokenType(this.TokenNames.FUNCTION)); // Expecting 'HAM'
		const name = this.require(this.getTokenType(this.TokenNames.VARIABLE)); // Function name
		this.require(this.getTokenType(this.TokenNames.LPAR)); // Expecting '('

		const params: Token[] = [];
		if (this.match(this.getTokenType(this.TokenNames.RPAR)) == null) {
			do {
				params.push(
					this.require(this.getTokenType(this.TokenNames.VARIABLE))
				);
			} while (
				this.match(this.getTokenType(this.TokenNames.COMMA)) != null
			);
			this.require(this.getTokenType(this.TokenNames.RPAR)); // Expecting ')'
		}

		const body = this.parseBraces() as StatementsNode; // Function body

		return new FunctionDeclarationNode(name, params, body);
	}

	// Parse function call
	parseFunctionCall(name: Token): ExpressionNode {
		this.require(this.getTokenType(this.TokenNames.LPAR)); // Expecting '('

		const args: ExpressionNode[] = [];
		if (this.match(this.getTokenType(this.TokenNames.RPAR)) == null) {
			do {
				args.push(this.parseFormula());
			} while (
				this.match(this.getTokenType(this.TokenNames.COMMA)) != null
			);
			this.require(this.getTokenType(this.TokenNames.RPAR)); // Expecting ')'
		}

		return new FunctionCallNode(name, args);
	}

	// Parse return statement
	parseReturn(): ExpressionNode {
		// Already matched the 'RETURN' token in parseExpression.
		const token = this.require(this.getTokenType(this.TokenNames.RETURN));
		const expr = this.parseFormula();
		// Optionally require a semicolon if needed:
		this.require(this.getTokenType(this.TokenNames.SEMICOLON));
		return new ReturnNode(expr);
	}

	// Parse expressions
	parseExpression(): ExpressionNode {
		const currentToken = this.tokens[this.pos];
		if (
			currentToken.type.name ===
			this.getTokenType(this.TokenNames.FUNCTION).name
		) {
			return this.parseFunctionDeclaration();
		}
		if (
			currentToken.type.name ===
			this.getTokenType(this.TokenNames.RETURN).name
		) {
			return this.parseReturn();
		}

		// Other checks
		if (this.match(this.getTokenType(this.TokenNames.VARIABLE)) === null) {
			if (this.match(this.getTokenType(this.TokenNames.LOG)) !== null) {
				this.pos -= 1;
				return this.parsePrint();
			}
			if (this.match(this.getTokenType(this.TokenNames.IF))) {
				this.pos -= 1;
				return this.parseIfStatement();
			}
		}

		this.pos -= 1;
		let variableNode = this.parseVariableOrDataTypes();
		const assignOperator = this.match(
			this.getTokenType(this.TokenNames.ASSIGN)
		);
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
		this.require(this.getTokenType(this.TokenNames.IF)); // Expecting 'NEU'
		const condition = this.parseFormula(); // Parsing the condition

		// Ensure that we expect a left curly brace
		if (this.match(this.getTokenType(this.TokenNames.LBRACE)) === null) {
			throw new Error(`Expected '{' at position: ${this.pos}`);
		}

		const trueBlock = this.parseContext(); // Parsing the true block

		// Move back one position because parseContext uses the match method to check for RBRACE
		this.pos -= 1;

		this.require(this.getTokenType(this.TokenNames.RBRACE)); // Expecting '}'

		let falseBlock: ExpressionNode | null = null; // Initializing the false block
		if (this.match(this.getTokenType(this.TokenNames.ELSE)) !== null) {
			// Checking for 'KO THI'
			if (this.match(this.getTokenType(this.TokenNames.IF)) !== null) {
				// If 'else if' exists
				this.pos -= 1; // Move back one position because we use the match method
				falseBlock = this.parseIfStatement(); // Recursively parse else if
			} else {
				if (
					this.match(this.getTokenType(this.TokenNames.LBRACE)) ===
					null
				) {
					throw new Error(`Expected '{' at position: ${this.pos}`);
				}
				falseBlock = this.parseContext(); // Parsing the false block

				// Move back one position because parseContext uses the match method to check for RBRACE
				this.pos -= 1;

				this.require(this.getTokenType(this.TokenNames.RBRACE)); // Expecting '}'
			}
		}

		return new IfNode(condition, trueBlock, falseBlock); // Creating IfNode
	}

	// Parse context
	parseContext(): ExpressionNode {
		const root = new StatementsNode();

		while (this.pos < this.tokens.length) {
			if (this.match(this.getTokenType(this.TokenNames.RBRACE)) !== null)
				break;

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
				this.require(this.getTokenType(this.TokenNames.SEMICOLON)); // Otherwise, expect ';'
				root.addNode(codeStringNode);
			}
		}
		return root;
	}

	parseCode(): ExpressionNode {
		return this.parseContext();
	}
}
