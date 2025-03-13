// Using type instead of class for immutability (FP principles)
export type TokenType = Readonly<{
	name: string;
	regex: string;
}>;

// Factory function for creating tokens, ensuring function purity (FP)
const createTokenType = (name: string, regex: string): TokenType => ({
	name,
	regex,
});

// Using enum for token naming, making the code safer and more convenient
export enum TokenNames {
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

// Immutable token map, adhering to SOLID principles (separating data from logic)
export const tokenTypesMap: Readonly<Record<TokenNames, TokenType>> = {
	[TokenNames.NUMBER]: createTokenType(TokenNames.NUMBER, "[0-9]+"),
	[TokenNames.VARIABLE]: createTokenType(TokenNames.VARIABLE, "[a-z]+"),
	[TokenNames.SEMICOLON]: createTokenType(TokenNames.SEMICOLON, "IM"),
	[TokenNames.SPACE]: createTokenType(TokenNames.SPACE, "[ \n\t\r]"),
	[TokenNames.ASSIGN]: createTokenType(TokenNames.ASSIGN, "\\="),
	[TokenNames.LOG]: createTokenType(TokenNames.LOG, "NOILIENTUC"),
	[TokenNames.MINUS]: createTokenType(TokenNames.MINUS, "\\-"),
	[TokenNames.PLUS]: createTokenType(TokenNames.PLUS, "\\+"),
	[TokenNames.MULT]: createTokenType(TokenNames.MULT, "\\*"),
	[TokenNames.DIV]: createTokenType(TokenNames.DIV, "\\/"),
	[TokenNames.EQUAL]: createTokenType(TokenNames.EQUAL, "UYTIN"),
	[TokenNames.LESS]: createTokenType(TokenNames.LESS, "ITHON"),
	[TokenNames.MORE]: createTokenType(TokenNames.MORE, "NHIEUHON"),
	[TokenNames.LESSEQ]: createTokenType(TokenNames.LESSEQ, "ITBANG"),
	[TokenNames.MOREQ]: createTokenType(TokenNames.MOREQ, "NHIEUBANG"),
	[TokenNames.LPAR]: createTokenType(TokenNames.LPAR, "\\("),
	[TokenNames.RPAR]: createTokenType(TokenNames.RPAR, "\\)"),
	[TokenNames.LBRACE]: createTokenType(TokenNames.LBRACE, "ME"),
	[TokenNames.RBRACE]: createTokenType(TokenNames.RBRACE, "MAY"),
	[TokenNames.IF]: createTokenType(TokenNames.IF, "NEU"),
	[TokenNames.ELSE]: createTokenType(TokenNames.ELSE, "KOTHI"),
	[TokenNames.STRING]: createTokenType(TokenNames.STRING, "'.+'"),
	[TokenNames.SINGLE_LINE_COMMENT]: createTokenType(
		TokenNames.SINGLE_LINE_COMMENT,
		"//.*"
	),
	[TokenNames.FUNCTION]: createTokenType(TokenNames.FUNCTION, "THE"),
	[TokenNames.RETURN]: createTokenType(TokenNames.RETURN, "TRA"),
	[TokenNames.COMMA]: createTokenType(TokenNames.COMMA, ","),
};

// Returns an array of tokens for iteration if needed
export const tokenTypesList = Object.values(tokenTypesMap);

// Function to retrieve a token by name with autocomplete
export const getTokenType = <T extends keyof typeof tokenTypesMap>(
	name: T
): TokenType => tokenTypesMap[name];
