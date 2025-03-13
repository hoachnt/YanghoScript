import { TokenType } from "./TokenType";

// Описание неизменяемого токена
export type Token = Readonly<{
	type: TokenType;
	text: string;
	pos: number;
}>;

// Фабричная функция для создания токена (FP)
export const createToken = (
	type: TokenType,
	text: string,
	pos: number
): Token => ({ type, text, pos });
