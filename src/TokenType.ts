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
  EQUAL: new TokenType("EQUAL", "EQUAL"),
  LESS: new TokenType("LESS", "LESS THAN"),
  MORE: new TokenType("MORE", "MORE THAN"),
  LESSEQ: new TokenType("LESSEQ", "LESS EQUALS"),
  MOREQ: new TokenType("MOREQ", "MORE EQUALS"),
  LPAR: new TokenType("LPAR", "\\("),
  RPAR: new TokenType("RPAR", "\\)"),
  LBRACE: new TokenType("LBRACE", "\\{"),
  RBRACE: new TokenType("RBRACE", "\\}"),
  STRING: new TokenType("STRING", "'.+'"),
  SINGLE_LINE_COMMENT: { name: "SINGLE_LINE_COMMENT", regex: "//.*" },
};
