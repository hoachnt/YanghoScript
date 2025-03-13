import ExpressionNode from "./ExpressionNode";
import { Token } from "../tokens";

export default class AssignNode extends ExpressionNode {
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
