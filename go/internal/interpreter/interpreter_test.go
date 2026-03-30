package interpreter

import (
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
