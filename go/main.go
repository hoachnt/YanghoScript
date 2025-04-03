package main

import (
	"fmt"
	"log"
	"os"

	"github.com/hoachnt/yanghoscript/internal/interpreter"
	"github.com/hoachnt/yanghoscript/internal/lexer"
	"github.com/hoachnt/yanghoscript/internal/parser"
)

func main() {
	// Открываем файл с кодом
	content, err := os.ReadFile("input.ys")
	if err != nil {
		log.Fatalf("Ошибка при чтении файла: %v", err)
	}

	// Создаем лексер
	l := lexer.NewLexer(string(content))

	// Генерируем токены
	var tokens []lexer.Token
	for {
		tok := l.NextToken()
		tokens = append(tokens, tok)
		if tok.Type == lexer.EOF {
			break
		}
	}

	// Вывод токенов для отладки
	for _, tok := range tokens {
		fmt.Printf("Token: %+v\n", tok)
	}

	// Создаем парсер
	p := parser.New(tokens)

	// Парсим код
	ast := p.ParseCode()

	// Выводим результат
	fmt.Printf("Parsed AST: %+v\n", ast)

	// Создаем интерпретатор
	interpreter := interpreter.NewInterpreter()

	fmt.Println("Executing result:")
	interpreter.Run(ast)
}
