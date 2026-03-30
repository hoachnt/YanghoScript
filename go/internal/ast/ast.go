package ast

type Node interface {
	Accept(visitor Visitor) any
}

type ExpressionNode interface {
	Node
}

type StatementsNode struct {
	Statements []Node
}

func (s *StatementsNode) Accept(visitor Visitor) any {
	return visitor.VisitStatementsNode(s)
}

type NumberNode struct {
	Value float64
}

func (n *NumberNode) Accept(visitor Visitor) any {
	return visitor.VisitNumberNode(n)
}

type StringNode struct {
	Value string
}

func (s *StringNode) Accept(visitor Visitor) any {
	return visitor.VisitStringNode(s)
}

type ListNode struct {
	Elements []ExpressionNode
}

func (l *ListNode) Accept(visitor Visitor) any {
	return visitor.VisitListNode(l)
}

type VariableNode struct {
	Name string
}

func (v *VariableNode) Accept(visitor Visitor) any {
	return visitor.VisitVariableNode(v)
}

// AssignNode binds a name. Immutable=true means CHOT (single assignment per scope).
type AssignNode struct {
	Variable  *VariableNode
	Value     ExpressionNode
	Immutable bool
}

func (a *AssignNode) Accept(visitor Visitor) any {
	return visitor.VisitAssignNode(a)
}

type BinOperationNode struct {
	Left     ExpressionNode
	Operator string
	Right    ExpressionNode
}

func (b *BinOperationNode) Accept(visitor Visitor) any {
	return visitor.VisitBinOperationNode(b)
}

type UnarOperationNode struct {
	Operator string
	Operand  ExpressionNode
}

func (u *UnarOperationNode) Accept(visitor Visitor) any {
	return visitor.VisitUnarOperationNode(u)
}

type IfNode struct {
	Condition  ExpressionNode
	ThenBranch Node
	ElseBranch Node
}

func (i *IfNode) Accept(visitor Visitor) any {
	return visitor.VisitIfNode(i)
}

type ReturnNode struct {
	Value ExpressionNode
}

func (r *ReturnNode) Accept(visitor Visitor) any {
	return visitor.VisitReturnNode(r)
}

// FunctionDeclarationNode: Name empty = lambda expression. Native is built-in (PHANG, LOC, GAP).
type FunctionDeclarationNode struct {
	Name       string
	Parameters []string
	Body       *StatementsNode
	Native     string
}

func (f *FunctionDeclarationNode) Accept(visitor Visitor) any {
	return visitor.VisitFunctionDeclarationNode(f)
}

// FunctionCallNode: use Name for foo(...); Callee for higher-order (expr)(...).
type FunctionCallNode struct {
	Name      string
	Callee    ExpressionNode
	Arguments []ExpressionNode
}

func (f *FunctionCallNode) Accept(visitor Visitor) any {
	return visitor.VisitFunctionCallNode(f)
}

type Visitor interface {
	VisitStatementsNode(node *StatementsNode) any
	VisitNumberNode(node *NumberNode) any
	VisitStringNode(node *StringNode) any
	VisitListNode(node *ListNode) any
	VisitVariableNode(node *VariableNode) any
	VisitAssignNode(node *AssignNode) any
	VisitBinOperationNode(node *BinOperationNode) any
	VisitUnarOperationNode(node *UnarOperationNode) any
	VisitIfNode(node *IfNode) any
	VisitReturnNode(node *ReturnNode) any
	VisitFunctionDeclarationNode(node *FunctionDeclarationNode) any
	VisitFunctionCallNode(node *FunctionCallNode) any
}
