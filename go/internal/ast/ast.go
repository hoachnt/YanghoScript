package ast

// Node - базовый интерфейс для всех узлов AST
type Node interface {
	Accept(visitor Visitor) any
}

// ExpressionNode - базовый интерфейс для всех выражений
type ExpressionNode interface {
	Node
}

// StatementsNode - список выражений (инструкций)
type StatementsNode struct {
	Statements []Node
}

func (s *StatementsNode) Accept(visitor Visitor) any {
	return visitor.VisitStatementsNode(s)
}

// NumberNode - числовой литерал
type NumberNode struct {
	Value float64
}

func (n *NumberNode) Accept(visitor Visitor) any {
	return visitor.VisitNumberNode(n)
}

// StringNode - строковый литерал
type StringNode struct {
	Value string
}

func (s *StringNode) Accept(visitor Visitor) any {
	return visitor.VisitStringNode(s)
}

// VariableNode - переменная
type VariableNode struct {
	Name string
}

func (v *VariableNode) Accept(visitor Visitor) any {
	return visitor.VisitVariableNode(v)
}

// AssignNode - присваивание
type AssignNode struct {
	Variable *VariableNode
	Value    ExpressionNode
}

func (a *AssignNode) Accept(visitor Visitor) any {
	return visitor.VisitAssignNode(a)
}

// BinOperationNode - бинарная операция
type BinOperationNode struct {
	Left     ExpressionNode
	Operator string
	Right    ExpressionNode
}

func (b *BinOperationNode) Accept(visitor Visitor) any {
	return visitor.VisitBinOperationNode(b)
}

// UnarOperationNode - унарная операция
type UnarOperationNode struct {
	Operator string
	Operand  ExpressionNode
}

func (u *UnarOperationNode) Accept(visitor Visitor) any {
	return visitor.VisitUnarOperationNode(u)
}

// IfNode - условный оператор
type IfNode struct {
	Condition  ExpressionNode
	ThenBranch Node
	ElseBranch Node
}

func (i *IfNode) Accept(visitor Visitor) any {
	return visitor.VisitIfNode(i)
}

// ReturnNode - оператор возврата
type ReturnNode struct {
	Value ExpressionNode
}

func (r *ReturnNode) Accept(visitor Visitor) any {
	return visitor.VisitReturnNode(r)
}

// FunctionDeclarationNode - объявление функции
type FunctionDeclarationNode struct {
	Name       string
	Parameters []string
	Body       *StatementsNode
}

func (f *FunctionDeclarationNode) Accept(visitor Visitor) any {
	return visitor.VisitFunctionDeclarationNode(f)
}

// FunctionCallNode - вызов функции
type FunctionCallNode struct {
	Name      string
	Arguments []ExpressionNode
}

func (f *FunctionCallNode) Accept(visitor Visitor) any {
	return visitor.VisitFunctionCallNode(f)
}

// Visitor - интерфейс посетителя для обхода AST
type Visitor interface {
	VisitStatementsNode(node *StatementsNode) any
	VisitNumberNode(node *NumberNode) any
	VisitStringNode(node *StringNode) any
	VisitVariableNode(node *VariableNode) any
	VisitAssignNode(node *AssignNode) any
	VisitBinOperationNode(node *BinOperationNode) any
	VisitUnarOperationNode(node *UnarOperationNode) any
	VisitIfNode(node *IfNode) any
	VisitReturnNode(node *ReturnNode) any
	VisitFunctionDeclarationNode(node *FunctionDeclarationNode) any
	VisitFunctionCallNode(node *FunctionCallNode) any
}
