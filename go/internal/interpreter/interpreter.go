package interpreter

import (
	"fmt"

	"github.com/hoachnt/yanghoscript/internal/ast"
	"github.com/hoachnt/yanghoscript/internal/lexer"
)

// Environment представляет окружение с переменными и функциями
type Environment struct {
	Scopes    []map[string]any
	Functions map[string]*ast.FunctionDeclarationNode
}

// PushScope добавляет новую область видимости
func (e *Environment) PushScope() {
	e.Scopes = append(e.Scopes, make(map[string]any))
}

// PopScope удаляет текущую область видимости
func (e *Environment) PopScope() {
	if len(e.Scopes) == 0 {
		panic("No scope to pop")
	}
	e.Scopes = e.Scopes[:len(e.Scopes)-1]
}

// CurrentScope возвращает текущую область видимости
func (e *Environment) CurrentScope() map[string]any {
	if len(e.Scopes) == 0 {
		panic("No scope available")
	}
	return e.Scopes[len(e.Scopes)-1]
}

// GetVariable ищет переменную в цепочке областей видимости
func (e *Environment) GetVariable(name string) (any, bool) {
	for i := len(e.Scopes) - 1; i >= 0; i-- {
		if value, exists := e.Scopes[i][name]; exists {
			return value, true
		}
	}
	return nil, false
}

// Interpreter выполняет узлы AST
type Interpreter struct {
	env Environment
}

// NewInterpreter создает новый экземпляр интерпретатора
func NewInterpreter() *Interpreter {
	return &Interpreter{
		env: Environment{
			Scopes:    []map[string]any{make(map[string]any)},
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
	i.env.CurrentScope()[node.Variable.Name] = value
	return value
}

// executeBinOperation выполняет бинарную операцию
func (i *Interpreter) executeBinOperation(node *ast.BinOperationNode) any {
	left := i.Run(node.Left)
	right := i.Run(node.Right)

	// Проверяем типы операндов
	switch leftTyped := left.(type) {
	case float64:
		// Если левый операнд — число, проверяем правый операнд
		rightTyped, ok := right.(float64)
		if !ok {
			panic(fmt.Sprintf("Type mismatch: cannot apply operator '%s' to types %T and %T", node.Operator, left, right))
		}

		// Выполняем операцию для чисел
		switch node.Operator {
		case "+":
			return leftTyped + rightTyped
		case "-":
			return leftTyped - rightTyped
		case "*":
			return leftTyped * rightTyped
		case "/":
			if rightTyped == 0 {
				panic("Division by zero")
			}
			return leftTyped / rightTyped
		case "UYTIN": // Equal (==)
			return leftTyped == rightTyped
		case "NHIEUHON": // Greater than (>)
			return leftTyped > rightTyped
		case "ITHON": // Less than (<)
			return leftTyped < rightTyped
		case "NHIEUHONHOACUYTIN": // Greater than or equal (>=)
			return leftTyped >= rightTyped
		case "ITHONHOACUYTIN": // Less than or equal (<=)
			return leftTyped <= rightTyped
		case "KHONGUYTIN": // Not equal (!=)
			return leftTyped != rightTyped
		default:
			panic(fmt.Sprintf("Unknown binary operator: %s", node.Operator))
		}

	case string:
		// Если левый операнд — строка, проверяем правый операнд
		rightTyped, ok := right.(string)
		if !ok {
			panic(fmt.Sprintf("Type mismatch: cannot apply operator '%s' to types %T and %T", node.Operator, left, right))
		}

		// Поддерживаем только конкатенацию для строк
		if node.Operator == "+" {
			return leftTyped + rightTyped
		} else {
			panic(fmt.Sprintf("Unsupported operator '%s' for strings", node.Operator))
		}

	default:
		panic(fmt.Sprintf("Unsupported operand type: %T", left))
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
	value, exists := i.env.GetVariable(node.Name)
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

// executeFunctionCall runs a function call. result is named so the defer can set the return
// value after recover from TRA (implemented via panic); otherwise the caller receives nil.
func (i *Interpreter) executeFunctionCall(node *ast.FunctionCallNode) (result any) {
	function, exists := i.env.Functions[node.Name]
	if !exists {
		panic(fmt.Sprintf("Function '%s' not found", node.Name))
	}

	i.env.PushScope()
	defer i.env.PopScope()

	for idx, param := range function.Parameters {
		argValue := i.Run(node.Arguments[idx])
		switch argValue.(type) {
		case float64, string:
			i.env.CurrentScope()[param] = argValue
		default:
			panic(fmt.Sprintf("Unsupported argument type for parameter '%s': %T", param, argValue))
		}
	}

	defer func() {
		if r := recover(); r != nil {
			if returnValue, ok := r.(ast.ExpressionNode); ok {
				result = i.Run(returnValue)
			} else {
				panic(r)
			}
		}
	}()

	i.Run(function.Body)
	return
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

