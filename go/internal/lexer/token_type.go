package lexer

import "regexp"

// TokenType представляет все возможные типы токенов в языке.
type TokenType string

const (
	EOF     TokenType = "EOF"
	ILLEGAL TokenType = "ILLEGAL"
	IDENT   TokenType = "IDENT"
	NUMBER  TokenType = "NUMBER"
	STRING  TokenType = "STRING"
	COMMENT TokenType = "COMMENT"

	// Operators
	ASSIGN   TokenType = "ASSIGN"
	PLUS     TokenType = "PLUS"
	MINUS    TokenType = "MINUS"
	MULTIPLY TokenType = "MULTIPLY"
	DIVIDE    TokenType = "DIVIDE"

	// Delimiters
	COMMA     TokenType = "COMMA"
	SEMICOLON TokenType = "SEMICOLON"
	LPAREN    TokenType = "LPAREN"
	RPAREN    TokenType = "RPAREN"
	LBRACE    TokenType = "LBRACE"
	RBRACE    TokenType = "RBRACE"

	// Keywords
	RETURN   TokenType = "RETURN"
	LOG      TokenType = "LOG"
	IF       TokenType = "IF"
	LBRACEKW TokenType = "LBRACE"
	RBRACEKW TokenType = "RBRACE"
	ELSE     TokenType = "ELSE"
	FUNCTION TokenType = "FUNCTION"
	EQUAL    TokenType = "EQUAL"
	GREATER  TokenType = "GREATER"
	LESS     TokenType = "LESS"
)

var keywords = map[string]TokenType{
	"TRA":        RETURN,
	"IM":         SEMICOLON,
	"NOILIENTUC": LOG,
	"NEU":        IF,
	"ME":         LBRACEKW,
	"MAY":        RBRACEKW,
	"KOTHI":      ELSE,
	"THE":        FUNCTION,
	"UYTIN":      EQUAL,
	"NHIEUHON":   GREATER,
	"ITHON":      LESS,
}

var tokenPatterns = map[TokenType]*regexp.Regexp{
	NUMBER:    regexp.MustCompile(`^\d+`),
	IDENT:     regexp.MustCompile(`^[a-zA-Z_][a-zA-Z0-9_]*`),
	STRING:    regexp.MustCompile(`^'[^']*'`),
	ASSIGN:    regexp.MustCompile(`^=`),
	PLUS:      regexp.MustCompile(`^\+`),
	MINUS:     regexp.MustCompile(`^-`),
	MULTIPLY:  regexp.MustCompile(`^\*`),
	DIVIDE:     regexp.MustCompile(`^/`),
	COMMA:     regexp.MustCompile(`^,`),
	SEMICOLON: regexp.MustCompile(`^;`),
	LPAREN:    regexp.MustCompile(`^\(`),
	RPAREN:    regexp.MustCompile(`^\)`),
	LBRACE:    regexp.MustCompile(`^\{`),
	RBRACE:    regexp.MustCompile(`^\}`),
	COMMENT:   regexp.MustCompile(`^(//.*|/\*.*?\*/)`),
}
