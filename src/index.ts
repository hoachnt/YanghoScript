import Lexer from "./Lexer";
import Parser from "./Parser";

const code =
    `
    summ EQUALS 6 PLUS 5;
    LOG summ;
    `

const lexer = new Lexer(code);

lexer.lexAnalysis()

const parser = new Parser(lexer.tokenList);

const rootNode = parser.parseCode()

parser.run(rootNode);