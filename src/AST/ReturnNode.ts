// filepath: src/AST/ReturnNode.ts
import ExpressionNode from "./ExpressionNode";

export default class ReturnNode extends ExpressionNode {
	expression: ExpressionNode;

	constructor(expression: ExpressionNode) {
		super();
		this.expression = expression;
	}
}
