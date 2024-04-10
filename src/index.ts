import Lexer from "./Lexer";
import Parser from "./Parser";

const code =
    `
    summ EQUALS 6 PLUS 5;
    LOG summ;
    sumandmin EQUALS summ MINUS (20 PLUS 2);
    LOG sumandmin;
    `

const lexer = new Lexer(code);

lexer.lexAnalysis()

const parser = new Parser(lexer.tokenList);

const rootNode = parser.parseCode()

parser.run(rootNode);