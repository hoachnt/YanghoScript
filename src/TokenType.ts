export default class TokenType {
  name: string;
  regex: string;

  constructor(name: string, regex: string) {
    this.name = name;
    this.regex = regex;
  }
}

export const tokenTypesList = {
  // STRING: new TokenType("STRING", "[a-zA-Z0-9\\s]"),
  NUMBER: new TokenType("NUMBER", "[0-9]*"),
  VARIABLE: new TokenType("VARIABLE", "[a-z]*"),
  SEMICOLON: new TokenType("SEMICOLON", ";"),
  SPACE: new TokenType("SPACE", "[ \\n\\t\\r]"),
  ASSIGN: new TokenType("ASSIGN", "\\="),
  LOG: new TokenType("LOG", "NOILIENTUC"),
  MINUS: new TokenType("MINUS", "\\-"),
  PLUS: new TokenType("PLUS", "\\+"),
  LPAR: new TokenType("LPAR", "\\("),
  RPAR: new TokenType("RPAR", "\\)"),
  STRING: new TokenType("STRING", "'.+'"),
};
