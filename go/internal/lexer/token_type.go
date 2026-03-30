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
	DIVIDE   TokenType = "DIVIDE"
	EQUAL    TokenType = "EQUAL"
	LESS     TokenType = "LESS"
	GREATER  TokenType = "GREATER"
	LESSEQ   TokenType = "LESSEQ"   // <=
	MOREQ    TokenType = "MOREQ"    // >=
	NOTEQUAL TokenType = "NOTEQUAL" // !=

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
	ELSE     TokenType = "ELSE"
	FUNCTION TokenType = "FUNCTION"
	WHILE    TokenType = "WHILE"
	FOR      TokenType = "FOR"
	BREAK    TokenType = "BREAK"
	CONTINUE TokenType = "CONTINUE"
)

var keywords = map[string]TokenType{
	"TRA":               RETURN,
	"IM":                SEMICOLON,
	"NOILIENTUC":        LOG,
	"NEU":               IF,
	"KOTHI":             ELSE,
	"ME":                LBRACE,
	"MAY":               RBRACE,
	"THE":               FUNCTION,
	"UYTIN":             EQUAL,
	"NHIEUHON":          GREATER,
	"ITHON":             LESS,
	"KHONGUYTIN":        NOTEQUAL,
	"NHIEUHONHOACUYTIN": MOREQ,
	"ITHONHOACUYTIN":    LESSEQ,
	"VONG":              WHILE,
	"CHO":               FOR,
	"DUNG":              BREAK,
	"TIEPTUC":           CONTINUE,
}

// tokenPatterns is ordered: longer lexemes and literals must be tried before shorter/prefix
// matches (e.g. == before =, <= before <). Map iteration in Go is randomized, so a slice is required.
var tokenPatterns = []struct {
	Type TokenType
	Re   *regexp.Regexp
}{
	{STRING, regexp.MustCompile(`^'[^']*'`)},
	{NUMBER, regexp.MustCompile(`^\d+`)},
	{LESSEQ, regexp.MustCompile(`^<=`)},
	{MOREQ, regexp.MustCompile(`^>=`)},
	{NOTEQUAL, regexp.MustCompile(`^!=`)},
	{EQUAL, regexp.MustCompile(`^==`)},
	{ASSIGN, regexp.MustCompile(`^=`)},
	{PLUS, regexp.MustCompile(`^\+`)},
	{MINUS, regexp.MustCompile(`^-`)},
	{MULTIPLY, regexp.MustCompile(`^\*`)},
	{DIVIDE, regexp.MustCompile(`^/`)},
	{LESS, regexp.MustCompile(`^<`)},
	{GREATER, regexp.MustCompile(`^>`)},
	{COMMA, regexp.MustCompile(`^,`)},
	{SEMICOLON, regexp.MustCompile(`^IM`)},
	{LPAREN, regexp.MustCompile(`^\(`)},
	{RPAREN, regexp.MustCompile(`^\)`)},
	{LBRACE, regexp.MustCompile(`^\{`)},
	{RBRACE, regexp.MustCompile(`^\}`)},
	{IDENT, regexp.MustCompile(`^[a-zA-Z_][a-zA-Z0-9_]*`)},
	{COMMENT, regexp.MustCompile(`^(//.*|/\*.*?\*/)`)},
}
