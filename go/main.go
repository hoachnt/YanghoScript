package main

import (
    "fmt"
    "log"
    "os"

    "github.com/hoachnt/yanghoscript/internal/lexer"
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

    // Генерируем токены
    var tokens []lexer.Token
    for {
        tok := l.NextToken()
        tokens = append(tokens, tok)
        if tok.Type == lexer.EOF {
            break
        }
    }

    fmt.Printf("Parsed tokens: %+v\n", tokens)
}