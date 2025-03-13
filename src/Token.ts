import { TokenType } from "./TokenType";

// Immutable token description
export type Token = Readonly<{
	type: TokenType;
	text: string;
	pos: number;
}>;

// Factory function for creating a token (FP)
export const createToken = (
	type: TokenType,
	text: string,
	pos: number
): Token => ({ type, text, pos });
