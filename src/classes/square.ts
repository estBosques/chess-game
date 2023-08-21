import { PIECES } from "$src/utils/game-constants";

export default class Square {
	private _piece = '';
	private _color = '';
	private _hasPiece = false;
	private _hasMoved = false;
	private _hasCastled = false;
	private _enPassant = false;
	private _isCastlingOption = false;
	private _isPossibleMove = false;
	private _isDarkSquare = false;
	private _position: number[];

	constructor(
		isDarkSquare: boolean,
		position: number[],
		piece = '',
		color = '',
		hasMoved = false,
		enPassant = false
	) {
		this._isDarkSquare = isDarkSquare;
		this._position = position;
		this._hasMoved = hasMoved;
		this._enPassant = enPassant;

		if (piece !== '') {
			this._piece = piece;
			this._color = color;
			this._hasPiece = true;
		}
	}

	get piece(): string {
		return this._piece;
	}

	set piece(piece: string) {
		if (piece === '') {
			this._hasPiece = false;
			this._color = '';
		}

		this._piece = piece;
		this._hasPiece = true;
	}

	get color(): string {
		return this._color;
	}

	set color(color: string) {
		if (color === '') {
			this._hasPiece = false;
			this._color = '';
		}

		this._color = color;
		this._hasPiece = true;
	}

	get hasMoved(): boolean {
		return this._hasMoved;
	}

	set hasMoved(value: boolean) {
		this._hasMoved = value;
	}

	get enPassant(): boolean {
		return this._enPassant;
	}

	set enPassant(value: boolean) {
		this._enPassant = value;
	}

	get isPossibleMove(): boolean {
		return this._isPossibleMove;
	}

	public set isPossibleMove(value: boolean) {
		this._isPossibleMove = value;
	}

	get isCastlingMove(): boolean {
		return this._isCastlingOption;
	}

	public set isCastlingMove(value: boolean) {
		this._isCastlingOption = value;
	}

	get hasPiece(): boolean {
		return this._hasPiece;
	}

	set hasPiece(value: boolean) {
		this._hasPiece = value;
	}

	get isEmpty(): boolean {
		return !this._hasPiece;
	}

	get position(): number[] {
		return this._position;
	}

	get isDarkSquare(): boolean {
		return this._isDarkSquare;
	}

	isFromTurn(turn: string): boolean {
		return turn === this._color;
	}

	isFromOpponent(turn: string): boolean {
		return turn !== this._color;
	}

	toString(): string {
		const hasMoved = this.hasPiece && !this._hasMoved ? '*' : '';
		const enPassant = this.hasPiece && this.piece === PIECES.PAWN && this._enPassant ? '^' : '';
		return `${this._color}${this._piece}${hasMoved}${enPassant}`;
	}
}
