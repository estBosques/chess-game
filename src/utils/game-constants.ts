import type PiecesDict from '$interfaces/PieceDict';

export const PLAYER = 'P';
export const OPPONENT = 'O';

export const PIECES: PiecesDict = {
	PAWN: 'p',
	ROOK: 'r',
	KNIGHT: 'n',
	BISHOP: 'b',
	QUEEN: 'q',
	KING: 'k',

};

export function enumContainsValue (enumObj: object, value: string) {
	return Object.values(enumObj).includes(value);
}