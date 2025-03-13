// Используем type вместо класса для неизменяемости (принципы FP)
export type TokenType = Readonly<{
	name: string;
	regex: string;
}>;

// Фабрика для создания токенов, обеспечивая чистоту функций (FP)
const createTokenType = (name: string, regex: string): TokenType => ({
	name,
	regex,
});

// Используем enum для именования токенов, что делает код более безопасным и удобным
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

// Неизменяемая карта токенов, соблюдая принципы SOLID (отделяем данные от логики)
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

// Возвращаем массив токенов, если нужно итерироваться по ним
export const tokenTypesList = Object.values(tokenTypesMap);

// Функция для получения токена по имени
export const getTokenType = <T extends keyof typeof tokenTypesMap>(
	name: T
): TokenType => tokenTypesMap[name];
