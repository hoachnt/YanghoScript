import Interpreter from "./Interpreter";
import Lexer from "./Lexer";
import Parser from "./Parser";

export default function interpretCode(code: string) {
	const lexer = new Lexer(code);
	const interpreter = new Interpreter();

	lexer.lexAnalysis();

	const parser = new Parser(lexer.tokenList, code);
	const rootNode = parser.parseCode();

	interpreter.run(rootNode);
}
