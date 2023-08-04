import Square from '$src/classes/Square';
import { expect, describe, it, beforeEach } from 'vitest';


describe('Square', () => {
	let square: Square;

	beforeEach(() => {
		square = new Square(true, [0, 0]);
	});

	it('should initialize a square with default values', () => {
		expect(square.piece).toBe('');
		expect(square.color).toBe('');
		expect(square.hasMoved).toBe(false);
		expect(square.enPassant).toBe(false);
		expect(square.isPossibleMove).toBe(false);
		expect(square.hasPiece).toBe(false);
		expect(square.isEmpty).toBe(true);
		expect(square.position).toEqual([0, 0]);
		expect(square.isDarkSquare).toBe(true);
	});

	it('should set the piece and color', () => {
		square.piece = 'p';
		square.color = 'w';

		expect(square.piece).toBe('p');
		expect(square.color).toBe('w');
		expect(square.hasPiece).toBe(true);
		expect(square.isEmpty).toBe(false);
	});

	it('should update the hasMoved flag', () => {
		square.hasMoved = true;
		expect(square.hasMoved).toBe(true);
	});

	it('should update the enPassant flag', () => {
		square.enPassant = true;
		expect(square.enPassant).toBe(true);
	});

	it('should update the isPossibleMove flag', () => {
		square.isPossibleMove = true;
		expect(square.isPossibleMove).toBe(true);
	});

	it('should set the square and hasPiece flag correctly', () => {
		square.piece = 'pawn';
		expect(square.piece).toBe('pawn');
		expect(square.hasPiece).toBe(true);
	});

	it('should set the color and hasPiece flag correctly', () => {
		square.color = 'white';
		expect(square.color).toBe('white');
		expect(square.hasPiece).toBe(true);
	});

	it('should set the hasMoved flag correctly', () => {
		square.hasMoved = true;
		expect(square.hasMoved).toBe(true);
	});

	it('should set the enPassant flag correctly', () => {
		square.enPassant = true;
		expect(square.enPassant).toBe(true);
	});

	it('should set the isPossibleMove flag correctly', () => {
		square.isPossibleMove = true;
		expect(square.isPossibleMove).toBe(true);
	});

	it('should set the hasPiece flag correctly', () => {
		square.hasPiece = true;
		expect(square.hasPiece).toBe(true);
	});

	it('should return true if the square position is empty', () => {
		square.hasPiece = false;
		expect(square.isEmpty).toBe(true);
	});

	it('should return true if the square is from the given turn', () => {
		square.color = 'white';
		expect(square.isFromTurn('white')).toBe(true);
		expect(square.isFromTurn('black')).toBe(false);
	});

	it('should return true if the square is from the opponent turn', () => {
		square.color = 'white';
		expect(square.isFromOpponent('black')).toBe(true);
		expect(square.isFromOpponent('white')).toBe(false);
	});
});

