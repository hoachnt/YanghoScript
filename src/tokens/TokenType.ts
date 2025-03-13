// Используем type вместо class для иммутабельности (FP)
export type TokenType = Readonly<{
	name: string;
	regex: string;
}>;

// Фабрика для создания токенов, гарантируя чистоту функций (FP)
const createTokenType = <T extends TokenNames>(
	name: T,
	regex: string
): TokenType => ({
	name,
	regex,
});

// Enum для именования токенов (повышает безопасность кода)
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

// Определения токенов вынесены отдельно для удобства редактирования и расширяемости
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

// Автоматически создаем маппинг токенов, избегая дублирования кода
const tokenTypesMap = Object.freeze(
	Object.fromEntries(
		Object.entries(tokenDefinitions).map(([name, regex]) => [
			name,
			createTokenType(name as TokenNames, regex),
		])
	) as Record<TokenNames, TokenType>
);

// Список токенов для итерации
const tokenTypesList = Object.freeze(Object.values(tokenTypesMap));

const getTokenType = (name: TokenNames): TokenType => tokenTypesMap[name];

// Экспортируем объект с функциями для работы с токенами
export const useTokenType = () => ({
	getTokenType,
	tokenTypesList,
	TokenNames,
	tokenTypesMap,
});
