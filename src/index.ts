import Interpreter from "./Interpreter";
import { createLexer } from "./Lexer";
import Parser from "./Parser";
import { useToken, useTokenType } from "./tokens";

export default function interpretCode(code: string) {
	const { createToken } = useToken();
	const { getTokenType, tokenTypesList } = useTokenType();

	const lexer = createLexer(code, {
		createToken,
		getTokenType,
		tokenTypesList,
	});

	const interpreter = new Interpreter();
	const tokens = lexer.lexAnalysis();

	const parser = new Parser(tokens, code);
	const rootNode = parser.parseCode();

	interpreter.run(rootNode);
}
