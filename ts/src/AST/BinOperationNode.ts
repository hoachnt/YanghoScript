import { Token } from "../tokens";
import ExpressionNode from "./ExpressionNode";

export default class BinOperationNode extends ExpressionNode {
	operator: Token;
	leftNode: ExpressionNode;
	rightNode: ExpressionNode;

	constructor(
		operator: Token,
		leftNode: ExpressionNode,
		rightNode: ExpressionNode
	) {
		super();
		this.operator = operator;
		this.leftNode = leftNode;
		this.rightNode = rightNode;
	}
}
