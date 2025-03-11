export default class TokenType {
	name: string;
	regex: string;

	constructor(name: string, regex: string) {
		this.name = name;
		this.regex = regex;
	}
}

export const tokenTypesList = {
	NUMBER: new TokenType("NUMBER", "[0-9]+"),
	VARIABLE: new TokenType("VARIABLE", "[a-z]+"),
	SEMICOLON: new TokenType("SEMICOLON", ";"),
	SPACE: new TokenType("SPACE", "[ \\n\\t\\r]"),
	ASSIGN: new TokenType("ASSIGN", "BAYHETVAODAY"),
	LOG: new TokenType("LOG", "NOILIENTUC"),
	MINUS: new TokenType("MINUS", "TRU"),
	PLUS: new TokenType("PLUS", "CONG"),
	MULT: new TokenType("MULT", "NHAN"),
	DIV: new TokenType("DIV", "CHIA"),
	EQUAL: new TokenType("EQUAL", "UY TIN"),
	LESS: new TokenType("LESS", "IT HON"),
	MORE: new TokenType("MORE", "NHIEU HON"),
	LESSEQ: new TokenType("LESSEQ", "IT BANG"),
	MOREQ: new TokenType("MOREQ", "NHIEU BANG"),
	LPAR: new TokenType("LPAR", "\\("),
	RPAR: new TokenType("RPAR", "\\)"),
	LBRACE: new TokenType("LBRACE", "\\{"),
	RBRACE: new TokenType("RBRACE", "\\}"),
	IF: new TokenType("IF", "NEU"),
	ELSE: new TokenType("ELSE", "KO THI"),
	STRING: new TokenType("STRING", "'.+'"),
	SINGLE_LINE_COMMENT: { name: "SINGLE_LINE_COMMENT", regex: "//.*" },
	FUNCTION: new TokenType("FUNCTION", "HAM"),
	RETURN: new TokenType("RETURN", "TRA"),
	COMMA: new TokenType("COMMA", ","),
};
