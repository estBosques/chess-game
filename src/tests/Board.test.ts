import Board from '$src/classes/Board'; // Adjust the path as needed
import Square from '$src/classes/Square'; // Assuming the path to Square class is './Square', adjust if needed
import { expect, describe, it, beforeEach } from 'vitest';

describe('Board Class', () => {
	it('Should initialize a board with default values', () => {
		const board = new Board();

		expect(board.board).toHaveLength(8);
		expect(board.board[0]).toHaveLength(8);
		expect(board.board[0][0]).toBeInstanceOf(Square);
		expect(board.player).toBe('w');
		expect(board.opponent).toBe('b');
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

		expect(board.board).toHaveLength(8);
		expect(board.board[0]).toHaveLength(8);
		expect(board.board[0][0]).toBeInstanceOf(Square);
		expect(board.player).toBe('b');
		expect(board.opponent).toBe('w');
	});

	it('Should reset the board', () => {
		const board = new Board('b');
		board.resetBoard();

		expect(board.board).toHaveLength(8);
		expect(board.board[0]).toHaveLength(8);
		expect(board.board[0][0]).toBeInstanceOf(Square);
	});

});

describe('generateBoardFromStringMatrix', () => {
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
