import ExpressionNode from "./ExpressionNode";
import { Token } from "../Token";

export default class FunctionCallNode extends ExpressionNode {
	name: Token;
	args: ExpressionNode[];

	constructor(name: Token, args: ExpressionNode[]) {
		super();
		this.name = name;
		this.args = args;
	}
}
