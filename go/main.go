package main

import (
	"fmt"
	"os"

	"github.com/hoach-linux/yanghoscript/internal/lexer"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: yanghoscript <file.ys>")
		return
	}

	code := "print(42);"
	lexer.Tokenize(code)
}
