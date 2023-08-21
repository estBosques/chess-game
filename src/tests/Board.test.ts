import Board from '$src/classes/Board'; // Adjust the path as needed
import Square from '$src/classes/Square'; // Assuming the path to Square class is './Square', adjust if needed
import { expect, describe, it, beforeEach } from 'vitest';

describe('Board Class', () => {
	it('Should initialize a board with default values', () => {
		const customBoard = [
			['br*', 'bn*', 'bb*', 'bq*', 'bk*', 'bb*', 'bn*', 'br*'],
			['bp*', 'bp*', 'bp*', 'bp*', 'bp*', 'bp*', 'bp*', 'bp*'],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['wp*', 'wp*', 'wp*', 'wp*', 'wp*', 'wp*', 'wp*', 'wp*'],
			['wr*', 'wn*', 'wb*', 'wq*', 'wk*', 'wb*', 'wn*', 'wr*']
		];
		const board = new Board();

		expect(board.player).toBe('w');
		expect(board.opponent).toBe('b');

		expect(board.convertBoardToStringMatrix()).toEqual(customBoard);
	});

	it('Should initialize a board with custom values', () => {
		const customBoard = [
			['wr', 'wk', 'wb', 'wq', 'wk', 'wb', 'wk', 'wr'],
			['wp*', 'wp*', 'wp*', 'wp*', 'wp*', 'wp*', 'wp*', 'wp*'],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['bp*', 'bp*', 'bp*', 'bp*', 'bp*', 'bp*', 'bp*', 'bp*'],
			['br', 'bk', 'bb', 'bq', 'bk', 'bb', 'bk', 'br']
		];

		const board = new Board('b', customBoard);

		expect(board.player).toBe('b');
		expect(board.opponent).toBe('w');

		expect(board.convertBoardToStringMatrix()).toEqual(customBoard);
	});

	it('Should reset the board', () => {
		const board = new Board('b');
		board.resetBoard();

		expect(board.board).toHaveLength(8);
		expect(board.board[0]).toHaveLength(8);
		expect(board.board[0][0]).toBeInstanceOf(Square);
	});
});

describe('Custom board', () => {
	it('should generate the board correctly for valid input', () => {
		const customBoard = [
			['', '', '', '', '', '', '', ''],
			['wp*', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', 'wp', '', '', '', '', ''],
			['', '', '', 'bp', '', '', 'wp', 'bp^'],
			['', '', '', '', '', '', '', ''],
			['bp*', 'bp', '', '', '', 'wp', '', ''],
			['', 'bp*', '', '', '', 'bp*', '', '']
		];

		const board = new Board();

		board.generateBoardFromStringMatrix(customBoard);
		expect(board.convertBoardToStringMatrix()).toEqual(customBoard);
	});
});

describe('generateBoardFromStringMatrix throws error', () => {
	it('should throw an error if the board is not 8x8', () => {
		const board = new Board();

		const customBoard = [
			['', '', '', '', '', '', '', ''],
			['wp*', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', 'wp', '', '', '', '', ''],
			['', '', '', 'bp', '', '', 'wp', 'bp^'],
			['', '', '', '', '', '', '', ''],
			['bp*', 'bp', '', '', '', 'wp', '', '']
		];

		expect(() => board.generateBoardFromStringMatrix(customBoard)).toThrow(
			'Board must be 8x8. Creating a default board.'
		);
	});

	it('should throw an error if any row is not 8x8', () => {
		const board = new Board();

		const customBoard = [
			['', '', '', '', '', '', '', ''],
			['wp*', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', 'wp', '', '', '', '', ''],
			['', '', '', 'bp', '', '', 'wp', 'bp^'],
			['', '', '', '', '', '', '', ''],
			['bp*', 'bp', '', '', '', 'wp', ''],
			['bp*', 'bp', '', '', '', 'wp', '', '']
		];

		expect(() => board.generateBoardFromStringMatrix(customBoard)).toThrow(
			'Board must be 8x8. Creating a default board.'
		);
	});

	// Add more tests for other exception cases

	// Example test for invalid color
	it('should throw an error for invalid color', () => {
		const board = new Board();

		const customBoard = [
			['', '', '', '', '', '', '', ''],
			['wp*', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', 'wp', '', '', '', '', ''],
			['', '', '', 'gp', '', '', 'wp', 'bp^'],
			['', '', '', '', '', '', '', ''],
			['bp*', 'bp', '', '', '', 'wp', '', ''],
			['bp*', 'bp', '', '', '', 'wp', '', '']
		];

		expect(() => board.generateBoardFromStringMatrix(customBoard)).toThrow(
			"Invalid color, expected 'b' or 'w', but got: g. Creating a default board."
		);
	});

	// Example test for invalid piece
	it('should throw an error for invalid piece', () => {
		const board = new Board();

		const customBoard = [
			['', '', '', '', '', '', '', ''],
			['wp*', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', 'wp', '', '', '', '', ''],
			['', '', '', 'bp', '', '', 'wp', 'bp^'],
			['', '', '', '', '', '', '', ''],
			['bp*', 'bh', '', '', '', 'wp', '', ''],
			['bp*', 'bp', '', '', '', 'wp', '', '']
		];

		expect(() => board.generateBoardFromStringMatrix(customBoard)).toThrow(
			"Invalid piece, expected 'p', 'k', 'q', 'b', 'n' or 'r', but got: h. Creating a default board."
		);
	});
});

describe('Castling rules', () => {
	let board: Board;

	beforeEach(() => {
		const customBoard = [
			['', '', '', '', '', '', '', ''],
			['br*', '', '', 'bq', 'br*', '', 'bn', 'br*'],
			['', '', '', '', '', '', '', ''],
			['br', '', '', '', 'bk*', '', '', 'br*'],
			['', '', '', '', '', '', '', ''],
			['br*', '', '', 'bk', '', '', '', 'br*'],
			['', '', '', '', '', '', '', ''],
			['br*', '', '', '', 'bk*', '', '', 'br*']
		];

		board = new Board('b', customBoard);
	});

	it("Castling is valid when there's no piece between the king and the rook, and none of them has moves before", () => {
		const kingPiece = board.getPieceAt(7, 4);
		const validRooks = board.findValidRooks(kingPiece);

		expect(validRooks.length).toBe(2);
	});

	it('Castling is no valid when the king has moved', () => {
		const kingPiece = board.getPieceAt(5, 3);
		const validRooks = board.findValidRooks(kingPiece);

		expect(validRooks.length).toBe(0);
	});

	it('Castling is no valid when the rook has moved', () => {
		const kingPiece = board.getPieceAt(3, 4);
		const validRooks = board.findValidRooks(kingPiece);

		expect(validRooks.length).toBe(1);
	});

	it('Castling is no valid when there are pieces between the king and the rook', () => {
		const kingPiece = board.getPieceAt(1, 4);
		const validRooks = board.findValidRooks(kingPiece);

		expect(validRooks.length).toBe(0);
	});
});
