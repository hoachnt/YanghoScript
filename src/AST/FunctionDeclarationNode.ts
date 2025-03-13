import ExpressionNode from "./ExpressionNode";
import { Token } from "../tokens";
import StatementsNode from "./StatementsNode";

export default class FunctionDeclarationNode extends ExpressionNode {
	name: Token;
	params: Token[];
	body: StatementsNode;

	constructor(name: Token, params: Token[], body: StatementsNode) {
		super();
		this.name = name;
		this.params = params;
		this.body = body;
	}
}
