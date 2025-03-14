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

	const compiledRegexList = tokenTypesList.map(({ name, regex }) => ({
		name,
		regex: new RegExp(`^${regex}`),
	}));

	const skipSingleLineComment = (pos: number): number =>
		code.indexOf("\n", pos) + 1 || code.length;

	const skipMultiLineComment = (pos: number): number => {
		const endPos = code.indexOf("*/", pos + 2);
		return endPos === -1 ? code.length : endPos + 2;
	};

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

	const getNextToken = (pos: number): [number, Token | null] => {
		if (pos >= code.length) return [pos, null];
		if (code.startsWith("//", pos))
			return [skipSingleLineComment(pos), null];
		if (code.startsWith("/*", pos))
			return [skipMultiLineComment(pos), null];

		const token = matchToken(pos);
		return token ? [pos + token.text.length, token] : [pos, null];
	};

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
