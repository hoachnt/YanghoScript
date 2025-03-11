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
	SEMICOLON: new TokenType("SEMICOLON", "IM"),
	SPACE: new TokenType("SPACE", "[ \\n\\t\\r]"),
	ASSIGN: new TokenType("ASSIGN", "\\="),
	LOG: new TokenType("LOG", "NOILIENTUC"),
	MINUS: new TokenType("MINUS", "\\-"),
	PLUS: new TokenType("PLUS", "\\+"),
	MULT: new TokenType("MULT", "\\*"),
	DIV: new TokenType("DIV", "\\/"),
	EQUAL: new TokenType("EQUAL", "UYTIN"),
	LESS: new TokenType("LESS", "ITHON"),
	MORE: new TokenType("MORE", "NHIEUHON"),
	LESSEQ: new TokenType("LESSEQ", "ITBANG"),
	MOREQ: new TokenType("MOREQ", "NHIEUBANG"),
	LPAR: new TokenType("LPAR", "\\("),
	RPAR: new TokenType("RPAR", "\\)"),
	LBRACE: new TokenType("LBRACE", "ME"),
	RBRACE: new TokenType("RBRACE", "MAY"),
	IF: new TokenType("IF", "NEU"),
	ELSE: new TokenType("ELSE", "KOTHI"),
	STRING: new TokenType("STRING", "'.+'"),
	SINGLE_LINE_COMMENT: { name: "SINGLE_LINE_COMMENT", regex: "//.*" },
	FUNCTION: new TokenType("FUNCTION", "DIT"),
	RETURN: new TokenType("RETURN", "TRA"),
	COMMA: new TokenType("COMMA", ","),
};
