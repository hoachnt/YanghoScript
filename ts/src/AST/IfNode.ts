import ExpressionNode from "./ExpressionNode";

export default class IfNode extends ExpressionNode {
	condition: ExpressionNode;
	trueBlock: ExpressionNode;
	falseBlock: ExpressionNode | null;

	constructor(
		condition: ExpressionNode,
		trueBlock: ExpressionNode,
		falseBlock: ExpressionNode | null
	) {
		super();
		this.condition = condition;
		this.trueBlock = trueBlock;
		this.falseBlock = falseBlock;
	}
}
