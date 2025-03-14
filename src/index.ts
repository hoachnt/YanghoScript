import Interpreter from "./Interpreter";
import { createLexer } from "./Lexer";
import Parser from "./Parser";
import { useToken, useTokenType } from "./tokens";

export default function interpretCode(code: string) {
	const { createToken } = useToken();
	const { tokenTypesMap, tokenTypesList } = useTokenType();

	const lexer = createLexer(code, {
		createToken,
		tokenTypesMap,
		tokenTypesList,
	});
	const tokens = lexer.lexAnalysis();

	const parser = new Parser(tokens, code);
	const rootNode = parser.parseCode();

	new Interpreter().run(rootNode);
}
