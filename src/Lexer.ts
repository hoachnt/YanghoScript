import { useTokenType } from "./tokens";
import { Token, useToken } from "./tokens";

export default class Lexer {
	code: string;
	pos: number = 0;
	tokenList: Token[] = [];
	private createToken;
	private getTokenType;
	private TokenNames;
	private tokenTypesList;

	constructor(code: string) {
		const { createToken } = useToken();
		const { getTokenType, TokenNames, tokenTypesList } = useTokenType();

		this.code = code;
		this.createToken = createToken;
		this.getTokenType = getTokenType;
		this.TokenNames = TokenNames;
		this.tokenTypesList = tokenTypesList;
	}

	lexAnalysis(): Token[] {
		while (this.nextToken()) {}

		this.tokenList = this.tokenList.filter(
			(token) =>
				token.type.name !==
				this.getTokenType(this.TokenNames.SPACE).name
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

		const tokenTypesValues = Object.values(this.tokenTypesList);

		for (let i = 0; i < tokenTypesValues.length; i++) {
			const tokenType = tokenTypesValues[i];
			const regex = new RegExp("^" + tokenType.regex);
			const result = this.code.substr(this.pos).match(regex);

			if (result && result[0]) {
				const token = this.createToken(tokenType, result[0], this.pos);

				this.pos += result[0].length;
				this.tokenList.push(token);

				return true;
			}
		}
		throw new Error(`Error at this position: ${this.pos}`);
	}
}
