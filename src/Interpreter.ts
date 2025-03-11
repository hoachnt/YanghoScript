import BinOperationNode from "./AST/BinOperationNode";
import ExpressionNode from "./AST/ExpressionNode";
import FunctionCallNode from "./AST/FunctionCallNode";
import FunctionDeclarationNode from "./AST/FunctionDeclarationNode";
import IfNode from "./AST/IfNode";
import NumberNode from "./AST/NumberNode";
import ReturnNode from "./AST/ReturnNode";
import StatementsNode from "./AST/StatementsNode";
import StringNode from "./AST/StringNode";
import UnarOperationNode from "./AST/UnarOperationNode";
import VariableNode from "./AST/VariableNode";
import Token from "./Token";
import { tokenTypesList } from "./TokenType";

// Define an immutable environment interface.
export interface Environment {
	scope: Record<string, any>;
	functions: Record<string, FunctionDeclarationNode>;
}

// Evaluation result type carrying both computed value and the updated environment.
type EvalResult = { value: any; env: Environment };

class ReturnException {
	value: any;
	constructor(value: any) {
		this.value = value;
	}
}

function evaluate(node: ExpressionNode, env: Environment): EvalResult {
	if (node instanceof ReturnNode) {
		const result = evaluate(node.expression, env);
		throw new ReturnException(result.value);
	}

	// Function declaration: extend the functions map.
	if (node instanceof FunctionDeclarationNode) {
		return {
			value: undefined,
			env: {
				scope: { ...env.scope },
				functions: { ...env.functions, [node.name.text]: node },
			},
		};
	}

	// Function call: evaluate arguments, create a local scope and call the function body.
	if (node instanceof FunctionCallNode) {
		const func = env.functions[node.name.text];
		if (!func) {
			throw new Error(`Function '${node.name.text}' not found`);
		}
		let interimEnv = env;
		const args = node.args.map((arg) => {
			const res = evaluate(arg, interimEnv);
			interimEnv = res.env;
			return res.value;
		});
		const localScope = { ...env.scope };
		func.params.forEach((param, index) => {
			localScope[param.text] = args[index];
		});
		const funcEnv = {
			scope: localScope,
			functions: env.functions,
		};
		try {
			const result = evaluate(func.body, funcEnv);
			return { value: result.value, env: env };
		} catch (err) {
			if (err instanceof ReturnException) {
				return { value: err.value, env: env };
			}
			throw err;
		}
	}

	// If statement: evaluate condition and then one of the branches.
	if (node instanceof IfNode) {
		const conditionRes = evaluate(node.condition, env);
		if (conditionRes.value) {
			return evaluate(node.trueBlock, conditionRes.env);
		} else if (node.falseBlock) {
			return evaluate(node.falseBlock, conditionRes.env);
		} else {
			return { value: undefined, env: conditionRes.env };
		}
	}

	// Numeric literal.
	if (node instanceof NumberNode) {
		return { value: parseInt(node.number.text), env };
	}

	// String literal.
	if (node instanceof StringNode) {
		return { value: node.string.text.replace(/'/g, ""), env };
	}

	// Unary operation.
	if (node instanceof UnarOperationNode) {
		if (node.operator.type.name === tokenTypesList.LOG.name) {
			const operandRes = evaluate(node.operand, env);
			console.log(operandRes.value);
			return { value: undefined, env: operandRes.env };
		}
	}

	// Binary operations.
	if (node instanceof BinOperationNode) {
		switch (node.operator.type.name) {
			case tokenTypesList.PLUS.name: {
				const left = evaluate(node.leftNode, env);
				const right = evaluate(node.rightNode, left.env);
				return { value: left.value + right.value, env: right.env };
			}
			case tokenTypesList.MINUS.name: {
				const left = evaluate(node.leftNode, env);
				const right = evaluate(node.rightNode, left.env);
				return { value: left.value - right.value, env: right.env };
			}
			case tokenTypesList.MULT.name: {
				const left = evaluate(node.leftNode, env);
				const right = evaluate(node.rightNode, left.env);
				return { value: left.value * right.value, env: right.env };
			}
			case tokenTypesList.DIV.name: {
				const left = evaluate(node.leftNode, env);
				const right = evaluate(node.rightNode, left.env);
				return { value: left.value / right.value, env: right.env };
			}
			case tokenTypesList.EQUAL.name: {
				const left = evaluate(node.leftNode, env);
				const right = evaluate(node.rightNode, left.env);
				return { value: left.value == right.value, env: right.env };
			}
			case tokenTypesList.LESS.name: {
				const left = evaluate(node.leftNode, env);
				const right = evaluate(node.rightNode, left.env);
				return { value: left.value < right.value, env: right.env };
			}
			case tokenTypesList.MORE.name: {
				const left = evaluate(node.leftNode, env);
				const right = evaluate(node.rightNode, left.env);
				return { value: left.value > right.value, env: right.env };
			}
			case tokenTypesList.LESSEQ.name: {
				const left = evaluate(node.leftNode, env);
				const right = evaluate(node.rightNode, left.env);
				return { value: left.value <= right.value, env: right.env };
			}
			case tokenTypesList.MOREQ.name: {
				const left = evaluate(node.leftNode, env);
				const right = evaluate(node.rightNode, left.env);
				return { value: left.value >= right.value, env: right.env };
			}
			case tokenTypesList.ASSIGN.name: {
				const rightRes = evaluate(node.rightNode, env);
				if (!(node.leftNode instanceof VariableNode)) {
					throw new Error(
						"Left node of assignment must be a variable"
					);
				}
				const varName = node.leftNode.variable.text;
				const newScope = { ...env.scope, [varName]: rightRes.value };
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
	if (node instanceof VariableNode) {
		const varName = node.variable.text;
		if (env.scope.hasOwnProperty(varName)) {
			return { value: env.scope[varName], env };
		} else {
			throw new Error(`Variable '${varName}' not found`);
		}
	}

	// Statements: evaluate each statement sequentially, threading the updated environment.
	if (node instanceof StatementsNode) {
		let currentEnv = env;
		let lastValue: any = undefined;
		for (const statement of node.codeStrings) {
			const res = evaluate(statement, currentEnv);
			lastValue = res.value;
			currentEnv = res.env;
		}
		return { value: lastValue, env: currentEnv };
	}

	throw new Error("Unknown node type encountered!");
}

export default class Interpreter {
	private env: Environment = { scope: {}, functions: {} };

	run(node: ExpressionNode): any {
		try {
			const result = evaluate(node, this.env);
			this.env = result.env;
			return result.value;
		} catch (err) {
			if (err instanceof ReturnException) {
				// If a return is encountered at the top level, simply return its value.
				return err.value;
			}
			throw err;
		}
	}
}
