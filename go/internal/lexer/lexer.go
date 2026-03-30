package lexer

import (
	"fmt"
	"strings"
)

type Lexer struct {
	input string
	pos   int
}

func NewLexer(input string) *Lexer {
	return &Lexer{input: input, pos: 0}
}

func (l *Lexer) NextToken() Token {
	l.skipWhitespace()

	if l.pos >= len(l.input) {
		return Token{Type: EOF, Literal: "", Pos: l.pos}
	}

	remaining := l.input[l.pos:]

	// Обработка однострочных комментариев
	if strings.HasPrefix(remaining, "//") {
		l.skipSingleLineComment()
		return l.NextToken()
	}

	// Обработка многострочных комментариев
	if strings.HasPrefix(remaining, "/*") {
		l.skipMultiLineComment()
		return l.NextToken()
	}

	for _, tp := range tokenPatterns {
		if match := tp.Re.FindString(remaining); match != "" {
			l.pos += len(match)
			if tp.Type == IDENT {
				return Token{Type: lookupIdent(match), Literal: match, Pos: l.pos}
			}
			return Token{Type: tp.Type, Literal: match, Pos: l.pos}
		}
	}

	// Если ничего не совпало, возвращаем ILLEGAL
	char := string(l.input[l.pos])
	l.pos++
	return Token{Type: ILLEGAL, Literal: char, Pos: l.pos}
}

// Пропускаем однострочный комментарий
func (l *Lexer) skipSingleLineComment() {
	for l.pos < len(l.input) && l.input[l.pos] != '\n' {
		l.pos++
	}
}

// Пропускаем многострочный комментарий
func (l *Lexer) skipMultiLineComment() {
	l.pos += 2 // Пропускаем `/*`
	for l.pos < len(l.input)-1 {
		if l.input[l.pos] == '*' && l.input[l.pos+1] == '/' {
			l.pos += 2 // Пропускаем `*/`
			return
		}
		l.pos++
	}
}

// Пропускаем пробелы
func (l *Lexer) skipWhitespace() {
	for l.pos < len(l.input) && strings.Contains(" \t\n\r", string(l.input[l.pos])) {
		l.pos++
	}
}

// Проверяем, является ли идентификатор ключевым словом
func lookupIdent(ident string) TokenType {
	if tok, ok := keywords[ident]; ok {
		return tok
	}
	return IDENT
}

func (t Token) String() string {
	return fmt.Sprintf("{Type: %s, Literal: %s, Pos: %d}", t.Type, t.Literal, t.Pos)
}

// Tokenize генерирует все токены из входной строки
func (l *Lexer) Tokenize() []Token {
	var tokens []Token
	for {
		tok := l.NextToken()
		tokens = append(tokens, tok)
		if tok.Type == EOF {
			break
		}
	}
	return tokens
}
