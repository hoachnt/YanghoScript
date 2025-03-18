package main

import (
	"fmt"
	"log"
	"os"

	"github.com/hoach-linux/yanghoscript/internal/lexer"
)

func main() {
	// Открываем файл
	file, err := os.Open("input.ys") // Файл с кодом YanghoScript
	if err != nil {
		log.Fatalf("Ошибка при открытии файла: %v", err)
	}
	defer file.Close()

	// Читаем содержимое файла
	content, err := os.ReadFile("input.ys")
	if err != nil {
		log.Fatalf("Ошибка при чтении файла: %v", err)
	}

	// Создаем лексер
	l := lexer.NewLexer(string(content))

	// Читаем и выводим токены
	for {
		tok := l.NextToken()
		fmt.Println(tok)
		if tok.Type == lexer.EOF {
			break
		}
	}
}
