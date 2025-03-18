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
	ASSIGN   TokenType = "="
	PLUS     TokenType = "+"
	MINUS    TokenType = "-"
	ASTERISK TokenType = "*"
	SLASH    TokenType = "/"

	// Delimiters
	COMMA     TokenType = ","
	SEMICOLON TokenType = "SEMICOLON"
	LPAREN    TokenType = "("
	RPAREN    TokenType = ")"
	LBRACE    TokenType = "{"
	RBRACE    TokenType = "}"

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
	ASTERISK:  regexp.MustCompile(`^\*`),
	SLASH:     regexp.MustCompile(`^/`),
	COMMA:     regexp.MustCompile(`^,`),
	SEMICOLON: regexp.MustCompile(`^;`),
	LPAREN:    regexp.MustCompile(`^\(`),
	RPAREN:    regexp.MustCompile(`^\)`),
	LBRACE:    regexp.MustCompile(`^\{`),
	RBRACE:    regexp.MustCompile(`^\}`),
	COMMENT:   regexp.MustCompile(`^(//.*|/\*.*?\*/)`),
}
