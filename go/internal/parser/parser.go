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
	return &Parser{tokens: tokens, pos: 0}
}

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

func (p *Parser) require(types ...lexer.TokenType) *lexer.Token {
	token := p.match(types...)
	if token == nil {
		panic(fmt.Sprintf("Syntax Error: Expected %v at position %d", types, p.pos))
	}
	return token
}

func (p *Parser) parseVariableOrDataTypes() ast.ExpressionNode {
	if number := p.match(lexer.NUMBER); number != nil {
		val, _ := strconv.ParseFloat(number.Literal, 64)
		return &ast.NumberNode{Value: val}
	}

	if variable := p.match(lexer.IDENT); variable != nil {
		return &ast.VariableNode{Name: variable.Literal}
	}

	if str := p.match(lexer.STRING); str != nil {
		v := str.Literal
		if len(v) >= 2 && v[0] == '\'' && v[len(v)-1] == '\'' {
			v = v[1 : len(v)-1]
		}
		return &ast.StringNode{Value: v}
	}

	panic(fmt.Sprintf("Expected variable, number, or string at position %d, got token: %+v", p.pos, p.tokens[p.pos]))
}

func (p *Parser) parsePrint() ast.Node {
	logTok := p.require(lexer.LOG)
	return &ast.UnarOperationNode{
		Operator: string(logTok.Type),
		Operand:  p.parseFormula(),
	}
}

func (p *Parser) parseParamList() []string {
	params := []string{}
	for p.match(lexer.IDENT) != nil {
		params = append(params, p.tokens[p.pos-1].Literal)
		if p.match(lexer.COMMA) == nil {
			break
		}
	}
	return params
}

func (p *Parser) parseFunction() ast.Node {
	p.require(lexer.FUNCTION)
	if p.pos < len(p.tokens) && p.tokens[p.pos].Type == lexer.LPAREN {
		p.require(lexer.LPAREN)
		params := p.parseParamList()
		p.require(lexer.RPAREN)
		p.require(lexer.LBRACE)
		body := p.parseContext()
		p.require(lexer.RBRACE)
		return &ast.FunctionDeclarationNode{Name: "", Parameters: params, Body: body}
	}

	name := p.require(lexer.IDENT)
	p.require(lexer.LPAREN)
	params := p.parseParamList()
	p.require(lexer.RPAREN)
	p.require(lexer.LBRACE)
	body := p.parseContext()
	p.require(lexer.RBRACE)
	return &ast.FunctionDeclarationNode{Name: name.Literal, Parameters: params, Body: body}
}

func (p *Parser) parseBind() ast.Node {
	p.require(lexer.BIND)
	variable := p.require(lexer.IDENT)
	p.require(lexer.ASSIGN)
	value := p.parseFormula()
	return &ast.AssignNode{
		Variable:  &ast.VariableNode{Name: variable.Literal},
		Value:     value,
		Immutable: true,
	}
}

func (p *Parser) parseListLiteral() ast.ExpressionNode {
	p.require(lexer.LBRACKET)
	elements := []ast.ExpressionNode{}
	if p.match(lexer.RBRACKET) != nil {
		return &ast.ListNode{Elements: elements}
	}
	for {
		elements = append(elements, p.parseFormula())
		if p.match(lexer.RBRACKET) != nil {
			break
		}
		if p.match(lexer.COMMA) == nil {
			p.require(lexer.RBRACKET)
			break
		}
	}
	return &ast.ListNode{Elements: elements}
}

func (p *Parser) parsePrimary() ast.ExpressionNode {
	if p.match(lexer.LPAREN) != nil {
		node := p.parseFormula()
		p.require(lexer.RPAREN)
		return node
	}

	if p.pos < len(p.tokens) && p.tokens[p.pos].Type == lexer.LBRACKET {
		return p.parseListLiteral()
	}

	if p.pos < len(p.tokens) && p.tokens[p.pos].Type == lexer.FUNCTION {
		n := p.parseFunction()
		fd, ok := n.(*ast.FunctionDeclarationNode)
		if !ok || fd.Name != "" {
			panic("expected lambda expression (THE (args) ME ... MAY)")
		}
		return fd
	}

	if ident := p.match(lexer.IDENT); ident != nil {
		if p.pos < len(p.tokens) && p.tokens[p.pos].Type == lexer.LPAREN {
			return p.parseFunctionCall(ident).(ast.ExpressionNode)
		}
		return &ast.VariableNode{Name: ident.Literal}
	}

	return p.parseVariableOrDataTypes()
}

func (p *Parser) parseMultiplicative() ast.ExpressionNode {
	node := p.parsePrimary()
	for {
		if operator := p.match(lexer.MULTIPLY, lexer.DIVIDE); operator != nil {
			right := p.parsePrimary()
			node = &ast.BinOperationNode{Left: node, Operator: operator.Literal, Right: right}
			continue
		}
		break
	}
	return node
}

func (p *Parser) parseAdditive() ast.ExpressionNode {
	node := p.parseMultiplicative()
	for {
		if operator := p.match(lexer.PLUS, lexer.MINUS); operator != nil {
			right := p.parseMultiplicative()
			node = &ast.BinOperationNode{Left: node, Operator: operator.Literal, Right: right}
			continue
		}
		break
	}
	return node
}

func (p *Parser) parseIf() ast.ExpressionNode {
	p.require(lexer.IF)
	p.require(lexer.LPAREN)
	condition := p.parseFormula()
	p.require(lexer.RPAREN)
	if p.match(lexer.LBRACE) == nil {
		panic(fmt.Sprintf("Expected block at position: %d", p.pos))
	}
	trueBlock := p.parseContext()
	p.require(lexer.RBRACE)

	var falseBlock ast.ExpressionNode
	if p.match(lexer.ELSE) != nil {
		if p.match(lexer.IF) != nil {
			p.pos--
			falseBlock = p.parseIf()
		} else {
			if p.match(lexer.LBRACE) == nil {
				panic(fmt.Sprintf("Expected block at position: %d", p.pos))
			}
			falseBlock = p.parseContext()
			p.require(lexer.RBRACE)
		}
	}

	return &ast.IfNode{Condition: condition, ThenBranch: trueBlock, ElseBranch: falseBlock}
}

func (p *Parser) parseComparison() ast.ExpressionNode {
	node := p.parseAdditive()
	for {
		if operator := p.match(lexer.EQUAL, lexer.LESS, lexer.GREATER, lexer.LESSEQ, lexer.MOREQ, lexer.NOTEQUAL); operator != nil {
			right := p.parseAdditive()
			node = &ast.BinOperationNode{Left: node, Operator: operator.Literal, Right: right}
			continue
		}
		break
	}
	return node
}

func (p *Parser) parseFormula() ast.ExpressionNode {
	return p.parseComparison()
}

func (p *Parser) parseFunctionCall(name *lexer.Token) ast.Node {
	p.require(lexer.LPAREN)
	arguments := []ast.ExpressionNode{}
	if p.match(lexer.RPAREN) != nil {
		return &ast.FunctionCallNode{Name: name.Literal, Arguments: arguments}
	}
	for {
		arguments = append(arguments, p.parseFormula())
		if p.match(lexer.RPAREN) != nil {
			break
		}
		if p.match(lexer.COMMA) == nil {
			p.require(lexer.RPAREN)
			break
		}
	}
	return &ast.FunctionCallNode{Name: name.Literal, Arguments: arguments}
}

func (p *Parser) parseReturn() ast.Node {
	p.require(lexer.RETURN)
	value := p.parseFormula()
	return &ast.ReturnNode{Value: value}
}

func (p *Parser) parseContext() *ast.StatementsNode {
	statements := &ast.StatementsNode{}

	for p.pos < len(p.tokens) {
		if p.match(lexer.SEMICOLON) != nil {
			continue
		}

		if p.match(lexer.RBRACE) != nil {
			p.pos--
			break
		}

		if p.tokens[p.pos].Type == lexer.EOF {
			break
		}

		// Let parseIf consume THOI/KOTHI (else) for the surrounding NEU.
		if p.tokens[p.pos].Type == lexer.ELSE {
			break
		}

		switch p.tokens[p.pos].Type {
		case lexer.LOG:
			statements.Statements = append(statements.Statements, p.parsePrint())
		case lexer.IF:
			statements.Statements = append(statements.Statements, p.parseIf())
		case lexer.FUNCTION:
			statements.Statements = append(statements.Statements, p.parseFunction())
		case lexer.RETURN:
			statements.Statements = append(statements.Statements, p.parseReturn())
		case lexer.BIND:
			statements.Statements = append(statements.Statements, p.parseBind())
		case lexer.IDENT:
			name := p.tokens[p.pos]
			if p.pos+1 < len(p.tokens) && p.tokens[p.pos+1].Type == lexer.ASSIGN {
				panic("immutable bind: use CHOT name = value (không gán lại bằng '=' trần)")
			}
			if p.pos+1 < len(p.tokens) && p.tokens[p.pos+1].Type == lexer.LPAREN {
				p.pos++
				statements.Statements = append(statements.Statements, p.parseFunctionCall(&name))
			} else {
				panic(fmt.Sprintf("expected call or CHOT at position %d", p.pos))
			}
		default:
			panic(fmt.Sprintf("unexpected token in block: %v at %d", p.tokens[p.pos].Type, p.pos))
		}
	}

	return statements
}

func (p *Parser) ParseCode() (node *ast.StatementsNode, err error) {
	if len(p.tokens) == 0 {
		return nil, fmt.Errorf("no tokens to parse")
	}

	defer func() {
		if r := recover(); r != nil {
			switch v := r.(type) {
			case string:
				err = fmt.Errorf("%s", v)
			case error:
				err = v
			default:
				err = fmt.Errorf("%v", v)
			}
			node = nil
		}
	}()

	node = p.parseContext()
	return node, err
}
