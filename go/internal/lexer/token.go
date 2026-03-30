package lexer

// Token представляет отдельный токен в коде.
type Token struct {
	Type    TokenType
	Literal string
	Pos     int
}
