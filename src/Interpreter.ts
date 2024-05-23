import BinOperationNode from "./AST/BinOperationNode";
import ExpressionNode from "./AST/ExpressionNode";
import NumberNode from "./AST/NumberNode";
import StatementsNode from "./AST/StatementsNode";
import StringNode from "./AST/StringNode";
import UnarOperationNode from "./AST/UnarOperationNode";
import VariableNode from "./AST/VariableNode";
import { tokenTypesList } from "./TokenType";

export default class Interpreter {
  scope: any = {};

  // Method to execute parsed code
  run(node: ExpressionNode): any {
    if (node instanceof NumberNode) {
      return parseInt(node.number.text);
    }
    if (node instanceof StringNode) {
      return node.string.text.replace(/'/g, "");
    }
    if (node instanceof UnarOperationNode) {
      switch (node.operator.type.name) {
        case tokenTypesList.LOG.name:
          console.log(this.run(node.operand));
          return;
      }
    }
    if (node instanceof BinOperationNode) {
      switch (node.operator.type.name) {
        case tokenTypesList.PLUS.name:
          return this.run(node.leftNode) + this.run(node.rightNode);
        case tokenTypesList.MINUS.name:
          return this.run(node.leftNode) - this.run(node.rightNode);
        case tokenTypesList.MULT.name:
          return this.run(node.leftNode) * this.run(node.rightNode);
        case tokenTypesList.DIV.name:
          return this.run(node.leftNode) / this.run(node.rightNode);
        case tokenTypesList.ASSIGN.name:
          const result = this.run(node.rightNode);
          const variableNode = node.leftNode as VariableNode;
          this.scope[variableNode.variable.text] = result;
          return result;
      }
    }
    if (node instanceof VariableNode) {
      const variableName = node.variable.text;
      if (this.scope.hasOwnProperty(variableName)) {
        return this.scope[variableName];
      } else {
        throw new Error(`Variable '${variableName}' not found`);
      }
    }
    if (node instanceof StatementsNode) {
      node.codeStrings.forEach((codeString) => {
        this.run(codeString);
      });
      return;
    }
    throw new Error("Unknown node type encountered!");
  }
}
