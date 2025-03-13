// Use `type` instead of `class` for immutability (FP)
export type TokenType = Readonly<{
	name: string;
	regex: string;
}>;

// Factory for creating tokens, ensuring function purity (FP)
const createTokenType = <T extends TokenNames>(
	name: T,
	regex: string
): TokenType => ({
	name,
	regex,
});

// Enum for token naming (enhances code safety)
enum TokenNames {
	NUMBER = "NUMBER",
	VARIABLE = "VARIABLE",
	SEMICOLON = "SEMICOLON",
	SPACE = "SPACE",
	ASSIGN = "ASSIGN",
	LOG = "LOG",
	MINUS = "MINUS",
	PLUS = "PLUS",
	MULT = "MULT",
	DIV = "DIV",
	EQUAL = "EQUAL",
	LESS = "LESS",
	MORE = "MORE",
	LESSEQ = "LESSEQ",
	MOREQ = "MOREQ",
	LPAR = "LPAR",
	RPAR = "RPAR",
	LBRACE = "LBRACE",
	RBRACE = "RBRACE",
	IF = "IF",
	ELSE = "ELSE",
	STRING = "STRING",
	SINGLE_LINE_COMMENT = "SINGLE_LINE_COMMENT",
	FUNCTION = "FUNCTION",
	RETURN = "RETURN",
	COMMA = "COMMA",
}

// Token definitions are extracted separately for easier editing and extendability
const tokenDefinitions: Record<TokenNames, string> = {
	[TokenNames.NUMBER]: "[0-9]+",
	[TokenNames.VARIABLE]: "[a-z]+",
	[TokenNames.SEMICOLON]: "IM",
	[TokenNames.SPACE]: "[ \n\t\r]",
	[TokenNames.ASSIGN]: "\\=",
	[TokenNames.LOG]: "NOILIENTUC",
	[TokenNames.MINUS]: "\\-",
	[TokenNames.PLUS]: "\\+",
	[TokenNames.MULT]: "\\*",
	[TokenNames.DIV]: "\\/",
	[TokenNames.EQUAL]: "UYTIN",
	[TokenNames.LESS]: "ITHON",
	[TokenNames.MORE]: "NHIEUHON",
	[TokenNames.LESSEQ]: "ITBANG",
	[TokenNames.MOREQ]: "NHIEUBANG",
	[TokenNames.LPAR]: "\\(",
	[TokenNames.RPAR]: "\\)",
	[TokenNames.LBRACE]: "ME",
	[TokenNames.RBRACE]: "MAY",
	[TokenNames.IF]: "NEU",
	[TokenNames.ELSE]: "KOTHI",
	[TokenNames.STRING]: "'.+'",
	[TokenNames.SINGLE_LINE_COMMENT]: "//.*",
	[TokenNames.FUNCTION]: "THE",
	[TokenNames.RETURN]: "TRA",
	[TokenNames.COMMA]: ",",
};

// Automatically create a token mapping, avoiding code duplication
const tokenTypesMap = Object.freeze(
	Object.fromEntries(
		Object.entries(tokenDefinitions).map(([name, regex]) => [
			name,
			createTokenType(name as TokenNames, regex),
		])
	) as Record<TokenNames, TokenType>
);

// List of tokens for iteration
const tokenTypesList = Object.freeze(Object.values(tokenTypesMap));

const getTokenType = (name: TokenNames): TokenType => tokenTypesMap[name];

// Export an object with functions for working with tokens
export const useTokenType = () => ({
	getTokenType,
	tokenTypesList,
	TokenNames,
	tokenTypesMap,
});
