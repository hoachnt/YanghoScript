package interpreter

import (
	"fmt"

	"github.com/hoachnt/yanghoscript/internal/ast"
	"github.com/hoachnt/yanghoscript/internal/lexer"
)

// Environment представляет окружение с переменными и функциями
type Environment struct {
	Scope     map[string]any
	Functions map[string]*ast.FunctionDeclarationNode
}

// Interpreter выполняет узлы AST
type Interpreter struct {
	env Environment
}

// NewInterpreter создает новый экземпляр интерпретатора
func NewInterpreter() *Interpreter {
	return &Interpreter{
		env: Environment{
			Scope:     make(map[string]any),
			Functions: make(map[string]*ast.FunctionDeclarationNode),
		},
	}
}

// Run выполняет AST и возвращает результат
func (i *Interpreter) Run(node ast.Node) any {
	switch n := node.(type) {
	case *ast.StatementsNode:
		return i.executeStatements(n)
	case *ast.AssignNode:
		return i.executeAssign(n)
	case *ast.BinOperationNode:
		return i.executeBinOperation(n)
	case *ast.UnarOperationNode:
		return i.executeUnarOperation(n)
	case *ast.NumberNode:
		return n.Value
	case *ast.VariableNode:
		return i.executeVariable(n)
	case *ast.StringNode:
		return n.Value
	case *ast.FunctionDeclarationNode:
		return i.executeFunctionDeclaration(n)
	case *ast.FunctionCallNode:
		return i.executeFunctionCall(n)
	case *ast.IfNode:
		return i.executeIf(n)
	case *ast.ReturnNode:
		panic(n.Value) // Используем panic для возврата значения
	default:
		panic(fmt.Sprintf("Unknown node type: %T", n))
	}
}

// executeStatements выполняет список инструкций
func (i *Interpreter) executeStatements(node *ast.StatementsNode) any {
	var result any
	for _, stmt := range node.Statements {
		result = i.Run(stmt)
	}
	return result
}

// executeAssign выполняет присваивание
func (i *Interpreter) executeAssign(node *ast.AssignNode) any {
	value := i.Run(node.Value)
	i.env.Scope[node.Variable.Name] = value
	return value
}

// executeBinOperation выполняет бинарную операцию
func (i *Interpreter) executeBinOperation(node *ast.BinOperationNode) any {
	left := i.Run(node.Left).(float64)
	right := i.Run(node.Right).(float64)

	switch node.Operator {
	case "+":
		return left + right
	case "-":
		return left - right
	case "*":
		return left * right
	case "/":
		return left / right
	default:
		panic(fmt.Sprintf("Unknown binary operator: %s", node.Operator))
	}
}

// executeUnarOperation выполняет унарную операцию
func (i *Interpreter) executeUnarOperation(node *ast.UnarOperationNode) any {
	value := i.Run(node.Operand)
	if node.Operator == string(lexer.LOG) {
		fmt.Println(value)
		return nil
	}
	panic(fmt.Sprintf("Unknown unary operator: %s", node.Operator))
}

// executeVariable возвращает значение переменной
func (i *Interpreter) executeVariable(node *ast.VariableNode) any {
	value, exists := i.env.Scope[node.Name]
	if !exists {
		panic(fmt.Sprintf("Variable '%s' not found", node.Name))
	}
	return value
}

// executeFunctionDeclaration сохраняет функцию в окружении
func (i *Interpreter) executeFunctionDeclaration(node *ast.FunctionDeclarationNode) any {
	i.env.Functions[node.Name] = node
	return nil
}

// executeFunctionCall выполняет вызов функции
func (i *Interpreter) executeFunctionCall(node *ast.FunctionCallNode) any {
	function, exists := i.env.Functions[node.Name]
	if !exists {
		panic(fmt.Sprintf("Function '%s' not found", node.Name))
	}

	// Создаем локальное окружение для функции
	localEnv := Environment{
		Scope: make(map[string]any),
	}

	// Передаем аргументы
	for idx, param := range function.Parameters {
		localEnv.Scope[param] = i.Run(node.Arguments[idx])
	}

	// Выполняем тело функции
	defer func() {
		if r := recover(); r != nil {
			panic(r) // Возвращаем значение
		}
	}()
	return i.Run(function.Body)
}

// executeIf выполняет условный оператор
func (i *Interpreter) executeIf(node *ast.IfNode) any {
	condition := i.Run(node.Condition).(bool)
	if condition {
		return i.Run(node.ThenBranch)
	} else if node.ElseBranch != nil {
		return i.Run(node.ElseBranch)
	}
	return nil
}
