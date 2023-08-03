import Square from './square';
import { PIECES } from '$src/utils/game-constants';

export default class Game {
	private _player: string;
	private _opponent: string;
	private _board: Square[][];

	constructor(player = 'b') {
		this._player = player;
		this._opponent = player === 'b' ? 'w' : 'b';
		this._board = [];

		this.resetBoard();
	}

	resetBoard() {
		const order = [
			PIECES.ROOK,
			PIECES.KNIGHT,
			PIECES.BISHOP,
			PIECES.QUEEN,
			PIECES.KING,
			PIECES.BISHOP,
			PIECES.KNIGHT,
			PIECES.ROOK
		];

		const board: Square[][] = [];
		const pattern = this._player === 'w' ? 0 : 1;

		for (let i = 0; i < 8; i++) {
			const row: Square[] = [];
			for (let j = 0; j < 8; j++) {
				const squareColor = (i + j) % 2 === pattern;

				// If first or last row of the board
				if (i == 0 || i == 7) {
					const pieceColor = i == 7 ? this._player : this._opponent;

					if (this._player === 'b') {
						// If the player is black, switch the Queen and King
						if (order[j] === PIECES.QUEEN) {
							row.push(new Square(squareColor, [i, j], PIECES.KING, pieceColor));
						} else if (order[j] === PIECES.KING) {
							row.push(new Square(squareColor, [i, j], PIECES.QUEEN, pieceColor));
						} else {
							row.push(new Square(squareColor, [i, j], order[j], pieceColor));
						}
					} else {
						row.push(new Square(squareColor, [i, j], order[j], this._player));
					}
				} else if (i == 1 || i == 6) {
					const pieceColor = i == 6 ? this._player : this._opponent;

					row.push(new Square(squareColor, [i, j], PIECES.PAWN, pieceColor));
				} else {
					row.push(new Square(squareColor, [i, j]));
				}
			}
			board.push(row);
		}

		this._board = board;
	}

	get player(): string {
		return this._player;
	}

	set player(value: string) {
		this._player = value;
	}

	get opponent(): string {
		return this._opponent;
	}

	set opponent(value: string) {
		this._opponent = value;
	}

	get board(): Square[][] {
		return this._board;
	}
}
