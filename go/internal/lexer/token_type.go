package lexer

import "regexp"

// TokenType represents token kinds for YanghoScript (Vietnamese slang keywords + ASCII ops).
type TokenType string

const (
	EOF     TokenType = "EOF"
	ILLEGAL TokenType = "ILLEGAL"
	IDENT   TokenType = "IDENT"
	NUMBER  TokenType = "NUMBER"
	STRING  TokenType = "STRING"
	COMMENT TokenType = "COMMENT"

	ASSIGN   TokenType = "ASSIGN"
	PLUS     TokenType = "PLUS"
	MINUS    TokenType = "MINUS"
	MULTIPLY TokenType = "MULTIPLY"
	DIVIDE   TokenType = "DIVIDE"
	EQUAL    TokenType = "EQUAL"
	LESS     TokenType = "LESS"
	GREATER  TokenType = "GREATER"
	LESSEQ   TokenType = "LESSEQ"
	MOREQ    TokenType = "MOREQ"
	NOTEQUAL TokenType = "NOTEQUAL"

	COMMA     TokenType = "COMMA"
	SEMICOLON TokenType = "SEMICOLON"
	LPAREN    TokenType = "LPAREN"
	RPAREN    TokenType = "RPAREN"
	LBRACE    TokenType = "LBRACE"
	RBRACE    TokenType = "RBRACE"
	LBRACKET  TokenType = "LBRACKET"
	RBRACKET  TokenType = "RBRACKET"

	RETURN   TokenType = "RETURN"
	LOG      TokenType = "LOG"
	IF       TokenType = "IF"
	ELSE     TokenType = "ELSE"
	FUNCTION TokenType = "FUNCTION"
	BIND     TokenType = "BIND"
	WHILE    TokenType = "WHILE"
	FOR      TokenType = "FOR"
	BREAK    TokenType = "BREAK"
	CONTINUE TokenType = "CONTINUE"
)

// keywords: primary spellings + slang aliases → same token.
var keywords = map[string]TokenType{
	// return / end statement
	"TRA": RETURN,
	"IM":  SEMICOLON,
	"DI":  SEMICOLON,
	// IO (side effect)
	"NOILIENTUC": LOG,
	"KEU":        LOG,
	// condition
	"NEU":   IF,
	"THOI":  ELSE,
	"KOTHI": ELSE,
	// blocks
	"ME":   LBRACE,
	"MO":   LBRACE,
	"MAY":  RBRACE,
	"DONG": RBRACE,
	// function / immutable bind
	"THE": FUNCTION,
	"HUA": FUNCTION,
	"CHOT": BIND,
	// comparisons (Vietnamese phrasing)
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
	{SEMICOLON, regexp.MustCompile(`^(IM|DI)\b`)},
	{LPAREN, regexp.MustCompile(`^\(`)},
	{RPAREN, regexp.MustCompile(`^\)`)},
	{LBRACKET, regexp.MustCompile(`^\[`)},
	{RBRACKET, regexp.MustCompile(`^\]`)},
	{LBRACE, regexp.MustCompile(`^\{`)},
	{RBRACE, regexp.MustCompile(`^\}`)},
	{IDENT, regexp.MustCompile(`^[a-zA-Z_][a-zA-Z0-9_]*`)},
	{COMMENT, regexp.MustCompile(`^(//.*|/\*.*?\*/)`)},
}
