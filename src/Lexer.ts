import { Token, TokenNames, TokenType } from "./tokens";

type LexerDependencies = {
	createToken: (type: TokenType, value: string, pos: number) => Token;
	getTokenType: (name: TokenNames) => TokenType;
	tokenTypesList: readonly { name: TokenNames; regex: string }[];
};

export const createLexer = (code: string, dependencies: LexerDependencies) => {
	const { createToken, getTokenType, tokenTypesList } = dependencies;

	// Skips single-line comments and returns the new position
	const skipSingleLineComment = (pos: number): number =>
		code.indexOf("\n", pos) + 1 || code.length;

	// Finds the first matching token without creating an array
	const matchToken = (
		pos: number
	): { name: TokenNames; match: RegExpMatchArray } | null => {
		for (const { name, regex } of tokenTypesList) {
			const match = code.substring(pos).match(new RegExp(`^${regex}`));
			if (match) return { name, match };
		}
		return null;
	};

	// Finds the next token, returns the new position and the found token (or null)
	const nextToken = (pos: number): [number, Token | null] => {
		if (pos >= code.length) return [pos, null];

		if (code.startsWith("//", pos))
			return [skipSingleLineComment(pos), null];

		const tokenMatch = matchToken(pos);
		if (tokenMatch) {
			const { name, match } = tokenMatch;
			const token = createToken(getTokenType(name), match[0], pos);
			return [pos + match[0].length, token];
		}

		return [pos, null];
	};

	// Main function for lexical analysis (recursive traversal)
	const lexAnalysis = (pos = 0, tokens: Token[] = []): Token[] => {
		if (pos >= code.length) {
			return tokens.filter(
				({ type }) => type.name !== getTokenType(TokenNames.SPACE).name
			);
		}

		const [newPos, token] = nextToken(pos);
		return lexAnalysis(newPos, token ? [...tokens, token] : tokens);
	};

	return { lexAnalysis };
};
