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
	fmt.Printf("Requiring token: %v at position %d, current token: %+v\n", types, p.pos, p.tokens[p.pos]) // Отладочный вывод
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

	if str := p.match(lexer.STRING); str != nil {
		return &ast.StringNode{Value: str.Literal}
	}

	panic(fmt.Sprintf("Expected variable, number, or string at position %d, got token: %+v", p.pos, p.tokens[p.pos]))
}

// Parse print statement
func (p *Parser) parsePrint() ast.Node {
	logToken := p.require(lexer.LOG)                                  // Убедитесь, что токен LOG существует
	fmt.Printf("Parsing print statement with token: %+v\n", logToken) // Отладочный вывод

	return &ast.UnarOperationNode{
		Operator: string(logToken.Type), // Используем значение токена
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

// Parse if-else statement
func (p *Parser) parseIf() ast.ExpressionNode {
	p.require(lexer.IF)           // Expecting 'NEU'
	p.require(lexer.LPAREN)       // Ensure opening parenthesis
	condition := p.parseFormula() // Parsing the condition
	p.require(lexer.RPAREN)       // Ensure closing parenthesis

	// Ensure that we expect a left curly brace
	if p.match(lexer.LBRACE) == nil {
		panic(fmt.Sprintf("Expected '{' at position: %d", p.pos))
	}

	trueBlock := p.parseContext() // Parsing the true block

	p.require(lexer.RBRACE) // Expecting '}'

	var falseBlock ast.ExpressionNode = nil // Initializing the false block
	if p.match(lexer.ELSE) != nil {         // Checking for 'KO THI'
		if p.match(lexer.IF) != nil { // If 'else if' exists
			p.pos -= 1               // Move back one position because we use the match method
			falseBlock = p.parseIf() // Recursively parse else if
		} else {
			if p.match(lexer.LBRACE) == nil {
				panic(fmt.Sprintf("Expected '{' at position: %d", p.pos))
			}
			falseBlock = p.parseContext() // Parsing the false block

			p.require(lexer.RBRACE) // Expecting '}'
		}
	}

	return &ast.IfNode{
		Condition:  condition,
		ThenBranch: trueBlock,
		ElseBranch: falseBlock,
	}
}

// Parse comparison expressions (e.g., 2 UYTIN 1)
func (p *Parser) parseComparison() ast.ExpressionNode {
	node := p.parseAdditive() // Start with additive expressions

	for {
		// Match comparison operators
		if operator := p.match(lexer.EQUAL, lexer.LESS, lexer.GREATER, lexer.LESSEQ, lexer.MOREQ, lexer.NOTEQUAL); operator != nil {
			right := p.parseAdditive() // Parse the right-hand side
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
	return p.parseComparison()

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
// Parse context/block
func (p *Parser) parseContext() *ast.StatementsNode {
	statements := &ast.StatementsNode{}

	for p.pos < len(p.tokens) {
		// Skip delimiters
		if p.match(lexer.SEMICOLON) != nil {
			continue
		}

		// Check for end of block
		if p.match(lexer.RBRACE) != nil {
			p.pos-- // Move back one position to allow the caller to handle RBRACE
			break
		}

		// Check for end of file
		if p.tokens[p.pos].Type == lexer.EOF {
			break
		}

		// Parse statements
		switch p.tokens[p.pos].Type {
		case lexer.LOG:
			statements.Statements = append(statements.Statements, p.parsePrint())
		case lexer.IF:
			statements.Statements = append(statements.Statements, p.parseIf())
		default:
			statements.Statements = append(statements.Statements, p.parseAssignment())
		}
	}

	return statements
}

// Parse the entire program
func (p *Parser) ParseCode() ast.Node {
	return p.parseContext()
}
