import { Token } from "../tokens";

export default class StringNode {
	string: Token;

	constructor(string: Token) {
		this.string = string;
	}
}
