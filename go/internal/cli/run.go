package cli

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"

	"github.com/hoachnt/yanghoscript/internal/interpreter"
	"github.com/hoachnt/yanghoscript/internal/lexer"
	"github.com/hoachnt/yanghoscript/internal/parser"
)

// RunYSFromPath reads a .ys file and executes it (used by `run` and by `yanghoscript file.ys`).
func RunYSFromPath(path string) error {
	content, err := os.ReadFile(path)
	if err != nil {
		return fmt.Errorf("read file: %w", err)
	}
	return processFile(string(content))
}

// NewRunCommand создает команду для выполнения .ys файлов
func NewRunCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:          "run <file.ys>",
		Short:        "Run a YanghoScript file",
		Args:         cobra.ExactArgs(1),
		SilenceUsage: true,
		RunE: func(cmd *cobra.Command, args []string) error {
			return RunYSFromPath(args[0])
		},
	}
	return cmd
}

func illegalByteOffset(t lexer.Token) int {
	if t.Literal == "" {
		return t.Pos
	}
	return t.Pos - len(t.Literal)
}

// processFile обрабатывает содержимое файла
func processFile(content string) error {
	l := lexer.NewLexer(content)
	tokens := l.Tokenize()

	for _, t := range tokens {
		if t.Type == lexer.ILLEGAL {
			off := illegalByteOffset(t)
			return fmt.Errorf("illegal character %q at byte %d — if you see this with valid Go syntax, you may be using an old npm interpreter; build from go/ (see README)", t.Literal, off)
		}
	}

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
