import { Token, TokenNames, TokenType } from "./tokens";

interface ILexerDependencies {
	createToken: (type: TokenType, value: string, pos: number) => Token;
	tokenTypesList: ReadonlyArray<{ name: TokenNames; regex: string }>;
	tokenTypesMap: Readonly<
		Record<TokenNames, { name: TokenNames; regex: string }>
	>;
}

export const createLexer = (code: string, dependencies: ILexerDependencies) => {
	const { createToken, tokenTypesList, tokenTypesMap } = dependencies;

	// Precompile regular expressions to improve performance
	const compiledRegexList = tokenTypesList.map(({ name, regex }) => ({
		name,
		regex: new RegExp(`^${regex}`),
	}));

	// Function to skip single-line comments
	const skipSingleLineComment = (pos: number): number =>
		code.indexOf("\n", pos) + 1 || code.length;

	// Function to find a matching token
	const matchToken = (pos: number): Token | null => {
		const slice = code.slice(pos);
		return compiledRegexList.reduce<Token | null>(
			(found, { name, regex }) => {
				if (found) return found;
				const match = slice.match(regex);
				return match
					? createToken(tokenTypesMap[name], match[0], pos)
					: null;
			},
			null
		);
	};

	// Function to get the next token
	const getNextToken = (pos: number): [number, Token | null] => {
		if (pos >= code.length) return [pos, null];
		if (code.startsWith("//", pos))
			return [skipSingleLineComment(pos), null];

		const token = matchToken(pos);
		return token ? [pos + token.text.length, token] : [pos, null];
	};

	// Main lexical analysis function (functional approach)
	const lexAnalysis = (): Token[] => {
		const processTokens = (pos: number, tokens: Token[]): Token[] => {
			if (pos >= code.length) return tokens;
			const [newPos, token] = getNextToken(pos);
			return processTokens(
				newPos,
				token && token.type !== tokenTypesMap[TokenNames.SPACE]
					? [...tokens, token]
					: tokens
			);
		};

		return processTokens(0, []);
	};

	return { lexAnalysis };
};
