import { createToken, Token } from "./Token";
import { getTokenType, TokenNames, tokenTypesList } from "./TokenType";

export default class Lexer {
	code: string;
	pos: number = 0;
	tokenList: Token[] = [];

	constructor(code: string) {
		this.code = code;
	}

	lexAnalysis(): Token[] {
		while (this.nextToken()) {}

		this.tokenList = this.tokenList.filter(
			(token) => token.type.name !== getTokenType(TokenNames.SPACE).name
		);

		return this.tokenList;
	}

	skipSingleLineComment() {
		while (this.pos < this.code.length && this.code[this.pos] !== "\n") {
			this.pos++;
		}

		if (this.pos < this.code.length && this.code[this.pos] === "\n") {
			this.pos++;
		}
	}

	nextToken(): boolean {
		if (this.pos >= this.code.length) {
			return false;
		}

		if (this.code.startsWith("//", this.pos)) {
			this.skipSingleLineComment();

			return true;
		}

		const tokenTypesValues = Object.values(tokenTypesList);

		for (let i = 0; i < tokenTypesValues.length; i++) {
			const tokenType = tokenTypesValues[i];
			const regex = new RegExp("^" + tokenType.regex);
			const result = this.code.substr(this.pos).match(regex);

			if (result && result[0]) {
				const token = createToken(tokenType, result[0], this.pos);

				this.pos += result[0].length;
				this.tokenList.push(token);

				return true;
			}
		}
		throw new Error(`Error at this position: ${this.pos}`);
	}
}
