package cli

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"

	"github.com/hoachnt/yanghoscript/internal/interpreter"
	"github.com/hoachnt/yanghoscript/internal/lexer"
	"github.com/hoachnt/yanghoscript/internal/parser"
)

// NewRunCommand создает команду для выполнения .ys файлов
func NewRunCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:          "run <file.ys>",
		Short:        "Run a YanghoScript file",
		Args:         cobra.ExactArgs(1),
		SilenceUsage: true,
		RunE: func(cmd *cobra.Command, args []string) error {
			content, err := os.ReadFile(args[0])
			if err != nil {
				return fmt.Errorf("read file: %w", err)
			}
			return processFile(string(content))
		},
	}
	return cmd
}

// processFile обрабатывает содержимое файла
func processFile(content string) error {
	// Создаем лексер
	l := lexer.NewLexer(content)

	// Генерируем токены
	tokens := l.Tokenize()

	// Создаем парсер
	p := parser.New(tokens)

	// Парсим код
	ast, err := p.ParseCode()
	if err != nil {
		return err
	}

	interp := interpreter.NewInterpreter()
	interp.Run(ast)
	return nil
}
