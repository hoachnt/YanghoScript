export default class TokenType {
  name: string;
  regex: string;

  constructor(name: string, regex: string) {
    this.name = name;
    this.regex = regex;
  }
}

export const tokenTypesList = {
  NUMBER: new TokenType("NUMBER", "[0-9]*"),
  VARIABLE: new TokenType("VARIABLE", "[a-z]*"),
  SEMICOLON: new TokenType("SEMICOLON", ";"),
  SPACE: new TokenType("SPACE", "[ \\n\\t\\r]"),
  ASSIGN: new TokenType("ASSIGN", "\\="),
  LOG: new TokenType("LOG", "NOILIENTUC"),
  MINUS: new TokenType("MINUS", "\\-"),
  PLUS: new TokenType("PLUS", "\\+"),
  MULT: new TokenType("MULT", "\\*"),
  DIV: new TokenType("DIV", "\\/"),
  EQUAL: new TokenType("EQUAL", "BANG"),
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
};
