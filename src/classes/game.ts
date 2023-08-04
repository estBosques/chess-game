import Board from './Board';
import type Square from './Square';

export default class Game {
	private _player: string;
	private _opponent: string;
	private _turns = ['w', 'b'];
	private _currTurn = 0;
	private _board: Board;

	constructor(player = 'w', turn = 'w', overrideBoard?: string[][]) {
		this._player = player;
		this._opponent = player === 'b' ? 'w' : 'b';

		this._currTurn = turn === 'w' ? 0 : 1;

		if (overrideBoard) this._board = new Board(player, overrideBoard);
		else this._board = new Board(player);
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

	get board(): Board {
		return this._board;
	}

	getBoardAsIterable(): Square[][] {
		return this._board.board;
	}

	get turn(): string {
		return this._turns[this._currTurn];
	}

	nextTurn() {
		this._currTurn = (this._currTurn + 1) % 2;
	}

	selectSquare(pos: number[]): number[][] {
		const selectedPiece = this._board.getPieceAt(pos[0], pos[1]);

		if (selectedPiece.hasPiece && selectedPiece.isFromTurn(this.turn)) {
			return this._board.findPossibleMoves(selectedPiece, this.turn);
		}

		return [];
	}

	markSquare(pos: number[], value = true): void {
		this._board.getPieceAt(pos[0], pos[1]).isPossibleMove = value;
	}
}
