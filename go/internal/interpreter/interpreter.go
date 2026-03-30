package interpreter

import (
	"fmt"

	"github.com/hoachnt/yanghoscript/internal/ast"
	"github.com/hoachnt/yanghoscript/internal/lexer"
)

type Environment struct {
	Scopes    []map[string]any
	Functions map[string]*ast.FunctionDeclarationNode
}

func (e *Environment) PushScope() {
	e.Scopes = append(e.Scopes, make(map[string]any))
}

func (e *Environment) PopScope() {
	if len(e.Scopes) == 0 {
		panic("No scope to pop")
	}
	e.Scopes = e.Scopes[:len(e.Scopes)-1]
}

func (e *Environment) CurrentScope() map[string]any {
	if len(e.Scopes) == 0 {
		panic("No scope available")
	}
	return e.Scopes[len(e.Scopes)-1]
}

func (e *Environment) GetVariable(name string) (any, bool) {
	for i := len(e.Scopes) - 1; i >= 0; i-- {
		if value, exists := e.Scopes[i][name]; exists {
			return value, true
		}
	}
	return nil, false
}

type Interpreter struct {
	env Environment
}

func NewInterpreter() *Interpreter {
	i := &Interpreter{
		env: Environment{
			Scopes:    []map[string]any{make(map[string]any)},
			Functions: make(map[string]*ast.FunctionDeclarationNode),
		},
	}
	seedNatives(i)
	return i
}

func seedNatives(i *Interpreter) {
	natives := []struct {
		name string
		nArg int
	}{
		{"PHANG", 2},
		{"LOC", 2},
		{"GAP", 3},
	}
	for _, nat := range natives {
		params := make([]string, nat.nArg)
		for j := range params {
			params[j] = "_"
		}
		fn := &ast.FunctionDeclarationNode{Name: nat.name, Native: nat.name, Parameters: params}
		i.env.Functions[nat.name] = fn
		i.env.CurrentScope()[nat.name] = fn
	}
}

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
	case *ast.ListNode:
		return i.executeList(n)
	case *ast.FunctionDeclarationNode:
		return i.executeFunctionDeclaration(n)
	case *ast.FunctionCallNode:
		return i.executeFunctionCall(n)
	case *ast.IfNode:
		return i.executeIf(n)
	case *ast.ReturnNode:
		panic(n.Value)
	default:
		panic(fmt.Sprintf("Unknown node type: %T", n))
	}
}

func (i *Interpreter) executeList(node *ast.ListNode) any {
	out := make([]any, 0, len(node.Elements))
	for _, el := range node.Elements {
		out = append(out, i.Run(el))
	}
	return out
}

func (i *Interpreter) executeStatements(node *ast.StatementsNode) any {
	var result any
	for _, stmt := range node.Statements {
		result = i.Run(stmt)
	}
	return result
}

func (i *Interpreter) executeAssign(node *ast.AssignNode) any {
	if node.Immutable {
		if _, exists := i.env.CurrentScope()[node.Variable.Name]; exists {
			panic("CHOT: biến đã được gán trong scope này (immutable)")
		}
	}
	value := i.Run(node.Value)
	i.env.CurrentScope()[node.Variable.Name] = value
	return value
}

func cmpFloat(op string, a, b float64) bool {
	switch op {
	case "UYTIN", "==":
		return a == b
	case "NHIEUHON", ">":
		return a > b
	case "ITHON", "<":
		return a < b
	case "NHIEUHONHOACUYTIN", ">=":
		return a >= b
	case "ITHONHOACUYTIN", "<=":
		return a <= b
	case "KHONGUYTIN", "!=":
		return a != b
	default:
		panic(fmt.Sprintf("Unknown comparison operator: %s", op))
	}
}

func (i *Interpreter) executeBinOperation(node *ast.BinOperationNode) any {
	left := i.Run(node.Left)
	right := i.Run(node.Right)

	switch leftTyped := left.(type) {
	case float64:
		rightTyped, ok := right.(float64)
		if !ok {
			panic(fmt.Sprintf("Type mismatch: %T and %T", left, right))
		}
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
		case "UYTIN", "NHIEUHON", "ITHON", "NHIEUHONHOACUYTIN", "ITHONHOACUYTIN", "KHONGUYTIN",
			"==", "!=", "<", ">", "<=", ">=":
			return cmpFloat(node.Operator, leftTyped, rightTyped)
		default:
			panic(fmt.Sprintf("Unknown binary operator: %s", node.Operator))
		}

	case string:
		rightTyped, ok := right.(string)
		if !ok {
			panic(fmt.Sprintf("Type mismatch: %T and %T", left, right))
		}
		switch node.Operator {
		case "+":
			return leftTyped + rightTyped
		case "UYTIN", "==":
			return leftTyped == rightTyped
		case "KHONGUYTIN", "!=":
			return leftTyped != rightTyped
		default:
			panic(fmt.Sprintf("Unsupported operator '%s' for strings", node.Operator))
		}

	default:
		panic(fmt.Sprintf("Unsupported operand type: %T", left))
	}
}

func (i *Interpreter) executeUnarOperation(node *ast.UnarOperationNode) any {
	value := i.Run(node.Operand)
	if node.Operator == string(lexer.LOG) {
		fmt.Println(value)
		return nil
	}
	panic(fmt.Sprintf("Unknown unary operator: %s", node.Operator))
}

func (i *Interpreter) executeVariable(node *ast.VariableNode) any {
	value, exists := i.env.GetVariable(node.Name)
	if !exists {
		panic(fmt.Sprintf("Variable '%s' not found", node.Name))
	}
	return value
}

func (i *Interpreter) executeFunctionDeclaration(node *ast.FunctionDeclarationNode) any {
	if node.Native != "" {
		return nil
	}
	if node.Name != "" {
		i.env.Functions[node.Name] = node
		i.env.CurrentScope()[node.Name] = node
		return nil
	}
	return node
}

func (i *Interpreter) executeFunctionCall(node *ast.FunctionCallNode) (result any) {
	var fn *ast.FunctionDeclarationNode
	if node.Callee != nil {
		v := i.Run(node.Callee)
		var ok bool
		fn, ok = v.(*ast.FunctionDeclarationNode)
		if !ok || fn == nil {
			panic("call: callee is not a function")
		}
	} else {
		if v, ok := i.env.GetVariable(node.Name); ok {
			if f, ok := v.(*ast.FunctionDeclarationNode); ok {
				fn = f
			}
		}
		if fn == nil {
			fn = i.env.Functions[node.Name]
		}
	}
	if fn == nil {
		panic(fmt.Sprintf("Function '%s' not found", node.Name))
	}

	if fn.Native != "" {
		return i.nativeCall(fn.Native, node.Arguments)
	}

	i.env.PushScope()
	defer i.env.PopScope()

	for idx, param := range fn.Parameters {
		argValue := i.Run(node.Arguments[idx])
		switch v := argValue.(type) {
		case float64, string, bool:
			i.env.CurrentScope()[param] = v
		case []any:
			i.env.CurrentScope()[param] = v
		case *ast.FunctionDeclarationNode:
			i.env.CurrentScope()[param] = v
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

	i.Run(fn.Body)
	return
}

func (i *Interpreter) nativeCall(kind string, args []ast.ExpressionNode) any {
	switch kind {
	case "PHANG":
		if len(args) != 2 {
			panic("PHANG: cần 2 đối số (list, hàm)")
		}
		return i.nativeMap(args)
	case "LOC":
		if len(args) != 2 {
			panic("LOC: cần 2 đối số (list, hàm)")
		}
		return i.nativeFilter(args)
	case "GAP":
		if len(args) != 3 {
			panic("GAP: cần 3 đối số (list, acc, hàm 2 tham số)")
		}
		return i.nativeFold(args)
	default:
		panic("unknown native: " + kind)
	}
}

func (i *Interpreter) nativeMap(args []ast.ExpressionNode) any {
	listVal := i.Run(args[0])
	fnVal := i.Run(args[1])
	list, ok := listVal.([]any)
	if !ok {
		panic("PHANG: đối số 1 phải là list")
	}
	fn, ok := fnVal.(*ast.FunctionDeclarationNode)
	if !ok || fn.Native != "" {
		panic("PHANG: đối số 2 phải là hàm (lambda)")
	}
	if len(fn.Parameters) != 1 {
		panic("PHANG: hàm cần đúng 1 tham số")
	}
	out := make([]any, 0, len(list))
	for _, e := range list {
		out = append(out, i.callUnaryFunc(fn, e))
	}
	return out
}

func (i *Interpreter) nativeFilter(args []ast.ExpressionNode) any {
	listVal := i.Run(args[0])
	fnVal := i.Run(args[1])
	list, ok := listVal.([]any)
	if !ok {
		panic("LOC: đối số 1 phải là list")
	}
	fn, ok := fnVal.(*ast.FunctionDeclarationNode)
	if !ok || fn.Native != "" {
		panic("LOC: đối số 2 phải là hàm (lambda)")
	}
	if len(fn.Parameters) != 1 {
		panic("LOC: hàm cần đúng 1 tham số")
	}
	out := make([]any, 0)
	for _, e := range list {
		v := i.callUnaryFunc(fn, e)
		if b, ok := v.(bool); ok && b {
			out = append(out, e)
		}
	}
	return out
}

func (i *Interpreter) nativeFold(args []ast.ExpressionNode) any {
	listVal := i.Run(args[0])
	acc := i.Run(args[1])
	fnVal := i.Run(args[2])
	list, ok := listVal.([]any)
	if !ok {
		panic("GAP: đối số 1 phải là list")
	}
	fn, ok := fnVal.(*ast.FunctionDeclarationNode)
	if !ok || fn.Native != "" {
		panic("GAP: đối số 3 phải là hàm (lambda)")
	}
	if len(fn.Parameters) != 2 {
		panic("GAP: hàm cần đúng 2 tham số (acc, phần tử)")
	}
	for _, e := range list {
		acc = i.callBinaryFunc(fn, acc, e)
	}
	return acc
}

func (i *Interpreter) callUnaryFunc(fn *ast.FunctionDeclarationNode, arg any) (result any) {
	i.env.PushScope()
	defer i.env.PopScope()
	i.env.CurrentScope()[fn.Parameters[0]] = arg
	defer func() {
		if r := recover(); r != nil {
			if rv, ok := r.(ast.ExpressionNode); ok {
				result = i.Run(rv)
			} else {
				panic(r)
			}
		}
	}()
	i.Run(fn.Body)
	return
}

func (i *Interpreter) callBinaryFunc(fn *ast.FunctionDeclarationNode, acc, item any) (result any) {
	i.env.PushScope()
	defer i.env.PopScope()
	i.env.CurrentScope()[fn.Parameters[0]] = acc
	i.env.CurrentScope()[fn.Parameters[1]] = item
	defer func() {
		if r := recover(); r != nil {
			if rv, ok := r.(ast.ExpressionNode); ok {
				result = i.Run(rv)
			} else {
				panic(r)
			}
		}
	}()
	i.Run(fn.Body)
	return
}

func (i *Interpreter) executeIf(node *ast.IfNode) any {
	condition := i.Run(node.Condition).(bool)
	if condition {
		return i.Run(node.ThenBranch)
	} else if node.ElseBranch != nil {
		return i.Run(node.ElseBranch)
	}
	return nil
}
