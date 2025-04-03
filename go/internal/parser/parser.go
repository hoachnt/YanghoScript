package parser

import (
	"fmt"
	"strconv"

	"github.com/hoachnt/yanghoscript/internal/ast"
	"github.com/hoachnt/yanghoscript/internal/lexer"
)

type Parser struct {
	tokens []lexer.Token
	pos    int
}

func New(tokens []lexer.Token) *Parser {
	return &Parser{
		tokens: tokens,
		pos:    0,
	}
}

// Match checks if the current token matches any of the expected types
func (p *Parser) match(types ...lexer.TokenType) *lexer.Token {
	if p.pos < len(p.tokens) {
		currentToken := p.tokens[p.pos]
		for _, t := range types {
			if currentToken.Type == t {
				p.pos++
				return &currentToken
			}
		}
	}
	return nil
}

// Require ensures the current token matches the expected type or raises an error
func (p *Parser) require(types ...lexer.TokenType) *lexer.Token {
	token := p.match(types...)
	if token == nil {
		panic(fmt.Sprintf("Syntax Error: Expected %v at position %d", types, p.pos))
	}
	return token
}

// Parse variable, number, or string
func (p *Parser) parseVariableOrDataTypes() ast.ExpressionNode {
	if number := p.match(lexer.NUMBER); number != nil {
		val, _ := strconv.ParseFloat(number.Literal, 64)
		return &ast.NumberNode{Value: val}
	}

	if variable := p.match(lexer.IDENT); variable != nil {
		return &ast.VariableNode{Name: variable.Literal}
	}

	panic(fmt.Sprintf("Expected variable or number at position %d", p.pos))
}

// Parse print statement
func (p *Parser) parsePrint() ast.Node {
	logToken := p.require(lexer.LOG)                                  // Убедитесь, что токен LOG существует
	fmt.Printf("Parsing print statement with token: %+v\n", logToken) // Отладочный вывод

	return &ast.UnarOperationNode{
		Operator: logToken.Literal, // Используем значение токена
		Operand:  p.parseFormula(),
	}
}

// Parse primary expressions
func (p *Parser) parsePrimary() ast.ExpressionNode {
	if p.match(lexer.LPAREN) != nil {
		node := p.parseFormula()
		p.require(lexer.RPAREN)
		return node
	}
	return p.parseVariableOrDataTypes()
}

// Parse multiplication/division
func (p *Parser) parseMultiplicative() ast.ExpressionNode {
	node := p.parsePrimary()

	for {
		if operator := p.match(lexer.MULTIPLY, lexer.DIVIDE); operator != nil {
			right := p.parsePrimary()
			node = &ast.BinOperationNode{
				Left:     node,
				Operator: operator.Literal,
				Right:    right,
			}
			continue
		}
		break
	}

	return node
}

// Parse addition/subtraction
func (p *Parser) parseAdditive() ast.ExpressionNode {
	node := p.parseMultiplicative()

	for {
		if operator := p.match(lexer.PLUS, lexer.MINUS); operator != nil {
			right := p.parseMultiplicative()
			node = &ast.BinOperationNode{
				Left:     node,
				Operator: operator.Literal,
				Right:    right,
			}
			continue
		}
		break
	}

	return node
}

// Parse formula (top-level arithmetic)
func (p *Parser) parseFormula() ast.ExpressionNode {
	return p.parseAdditive()
}

// Parse assignment
func (p *Parser) parseAssignment() ast.Node {
	variable := p.require(lexer.IDENT)
	p.require(lexer.ASSIGN)
	value := p.parseFormula()
	return &ast.AssignNode{
		Variable: &ast.VariableNode{Name: variable.Literal},
		Value:    value,
	}
}

// Parse context/block
func (p *Parser) parseContext() *ast.StatementsNode {
	statements := &ast.StatementsNode{}

	for p.pos < len(p.tokens) {
		fmt.Printf("Current token in parseContext: %+v\n", p.tokens[p.pos]) // Отладочный вывод

		// Пропускаем символы-разделители (например, IM)
		if p.match(lexer.SEMICOLON) != nil {
			continue
		}

		// Проверяем, достигнут ли конец файла
		if p.tokens[p.pos].Type == lexer.EOF {
			break
		}

		// Проверяем, является ли текущий токен LOG
		if p.tokens[p.pos].Type == lexer.LOG {
			statements.Statements = append(statements.Statements, p.parsePrint())
		} else {
			statements.Statements = append(statements.Statements, p.parseAssignment())
		}
	}

	return statements
}

// Parse the entire program
func (p *Parser) ParseCode() ast.Node {
	return p.parseContext()
}
