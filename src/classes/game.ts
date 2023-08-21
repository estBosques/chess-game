import type Options from '$interfaces/Options';
import { PIECES } from '$src/utils/game-constants';
import Board from './Board';
import type Square from './Square';

export default class Game {
	private _player: string;
	private _opponent: string;
	private _turns = ['w', 'b'];
	private _currTurnString = () => this._turns[this._currTurn];
	private _showThreatMap = true;
	private _currTurn = 0;
	private _board: Board;
	private _possibleMoves: Map<string, number[]> = new Map();

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

	set board(board: Board) {
		this._board = board;
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

	selectSquare(pos: number[]): Map<string, number[]> {
		const selectedPiece = this._board.getPieceAt(pos[0], pos[1]);

		if (selectedPiece.hasPiece && selectedPiece.isFromTurn(this.turn)) {
			this._possibleMoves = this.board.calculateMovements(selectedPiece, this.turn);
		}
		return this._possibleMoves;
	}

	clearMarks() {
		for (const move of this._possibleMoves.values()) {
			this._board.markSquare(move);
		}

		this._possibleMoves = new Map();
	}

	showThreatMap(): Map<string, number[]> {
		this._showThreatMap = true;
		this._possibleMoves = this._board.generateThreatMap(this._currTurnString());

		return this._possibleMoves;
	}
}
