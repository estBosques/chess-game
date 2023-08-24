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
	private _selected:number[] = [];
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

	selectSquare(pos: number[], showThreatMap: boolean): Map<string, number[]> {
		const selectedPiece = this._board.getPieceAt(pos[0], pos[1]);

		// If the selected piece is from the current player
		// then select this piece and calculate its movement
		if (selectedPiece.isFromTurn(this.turn)) {
			this.clearMarks();

			this._possibleMoves = this.board.calculateMovements(selectedPiece, this.turn);
			this._selected = this._possibleMoves.size > 0 ? this._selected = [pos[0], pos[1]] : [];

		// if the selected piece is not from the current player
		// then it could be a switch
		} else if (!showThreatMap) {
			// if I already selected a piece and it's a valid move, then switch
			if (this._selected.length > 0 && this._possibleMoves.has(JSON.stringify(pos))) {
				this.board.movePiece(this._selected, pos);
			}

			this._possibleMoves = new Map();
			this._selected = [];
		}


		return this._possibleMoves;
	}

	/**
	 * Returns the square at the given position on the board.
	 *
	 * @param {number[]} pos - The position of the square on the board.
	 * @return {Square} The square at the given position.
	 */
	getSquare(pos: number[]): Square {
		return this._board.getPieceAt(pos[0], pos[1]);
	}

	isSquareEmpty(pos: number[]): boolean {
		return this._board.getPieceAt(pos[0], pos[1]).isEmpty;
	}

	clearMarks() {
		for (const move of this._possibleMoves.values()) {
			this._board.markSquare(move);
		}
	}

	showThreatMap(): Map<string, number[]> {
		this._showThreatMap = true;
		this._possibleMoves = this._board.generateThreatMap(this._currTurnString());

		return this._possibleMoves;
	}
}
