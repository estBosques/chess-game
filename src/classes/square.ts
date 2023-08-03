import { PIECES } from '$utils/game-constants';

export default class Square {
	private _name = '';
	private _color = '';
	private _hasPiece = false;
	private _hasMoved = false;
	private _enPassant = false;
	private _isPossibleMove = false;
	private _isDarkSquare = false;
	private _position: number[];

	constructor(isDarkSquare: boolean, position: number[], name = '', color = '') {
		this._isDarkSquare = isDarkSquare;
		this._position = position;

		if (name !== '') {
			this._name = name;
			this._color = color;
			this._hasPiece = true;
		}
	}

	get name(): string {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}

	get color(): string {
		return this._color;
	}

	set color(value: string) {
		this._color = value;
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

	set isPossibleMove(value: boolean) {
		this._isPossibleMove = value;
	}

	get hasPiece(): boolean {
		return this._hasPiece;
	}

	get position(): number[] {
		return this._position;
	}

	get isDarkSquare(): boolean {
		return this._isDarkSquare;
	}
}
