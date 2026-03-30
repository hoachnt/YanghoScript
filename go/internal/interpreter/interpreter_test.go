package interpreter

import (
	"strings"
	"testing"

	"github.com/hoachnt/yanghoscript/internal/ast"
	"github.com/hoachnt/yanghoscript/internal/lexer"
	"github.com/hoachnt/yanghoscript/internal/parser"
)

func TestGreetReturnsArgument(t *testing.T) {
	src := `THE greet(name) ME
	TRA name IM
MAY
`
	tree, err := parser.New(lexer.NewLexer(src).Tokenize()).ParseCode()
	if err != nil {
		t.Fatal(err)
	}
	fn := tree.Statements[0].(*ast.FunctionDeclarationNode)

	interp := NewInterpreter()
	interp.env.Functions[fn.Name] = fn

	out := interp.executeFunctionCall(&ast.FunctionCallNode{
		Name: "greet",
		Arguments: []ast.ExpressionNode{
			&ast.StringNode{Value: "Hoach"},
		},
	})
	if out != "Hoach" {
		t.Fatalf("greet('Hoach') = %v (%T), want Hoach", out, out)
	}
}

func TestCHOTDoubleBindPanics(t *testing.T) {
	src := `CHOT x = 1 IM
CHOT x = 2 IM`
	tree, err := parser.New(lexer.NewLexer(src).Tokenize()).ParseCode()
	if err != nil {
		t.Fatal(err)
	}
	interp := NewInterpreter()
	defer func() {
		r := recover()
		if r == nil {
			t.Fatal("expected panic on second CHOT in same scope")
		}
		s, _ := r.(string)
		if !strings.Contains(s, "CHOT") {
			t.Fatalf("unexpected panic: %v", r)
		}
	}()
	interp.Run(tree)
}
