import { expect, describe, it, beforeEach } from 'vitest';
import Board from '$src/classes/Board';

describe('Find Possible moves for pawn', () => {
	let board: Board;

	beforeEach(() => {
		// Set up the board
		const boardArray = [
			['', '', '', '', '', '', '', ''],
			['wp*', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', 'wp', '', '', '', '', ''],
			['', '', '', 'bp', '', '', 'wp', 'bp^'],
			['', '', '', '', '', '', '', ''],
			['bp*', 'bp', '', '', '', 'wp', '', ''],
			['', 'bp*', '', '', '', 'bp*', '', '']
		];

		board = new Board('b', boardArray);
	});

	it('A pawn can move two spaces the first time it is moved', () => {
		const selectedPiece = board.getPieceAt(6, 0);
		const turn = 'b';
		const expectedMoves = [
			[4, 0],
			[5, 0]
		];
		expect(board.findPossibleMoves(selectedPiece, turn)).toEqual(
			expect.arrayContaining(expectedMoves)
		);
	});

	it("A pawn can't move two spaces if there's an opponent in front", () => {
		const selectedPiece = board.getPieceAt(7, 5);
		const turn = 'b';
		expect(board.findPossibleMoves(selectedPiece, turn)).toHaveLength(0);
	});

	it("A pawn can't move two spaces if there's a friendly piece in front", () => {
		const selectedPiece = board.getPieceAt(7, 1);
		const turn = 'b';
		expect(board.findPossibleMoves(selectedPiece, turn)).toHaveLength(0);
	});

	it('A pawn can capture a piece that moved to spaces the last turn (en passant rule)', () => {
		const selectedPiece = board.getPieceAt(4, 6);
		const turn = 'w';
		const expectedMoves = [
			[5, 6],
			[5, 7]
		];
		const resultMoves = board.findPossibleMoves(selectedPiece, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});

	it('A pawn can capture a piece that is diagonal to itself moving forward', () => {
		const selectedPiece = board.getPieceAt(3, 2);
		const turn = 'w';
		const expectedMoves = [
			[4, 2],
			[4, 3]
		];
		const resultMoves = board.findPossibleMoves(selectedPiece, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});
});

describe('Find possible moves for a Rook', () => {
	let board: Board;

	beforeEach(() => {
		// Set up the board
		const boardArray = [
			['wr', '', 'wb', '', '', '', '', ''],
			['wp*', '', '', '', '', '', '', ''],
			['', '', '', '', 'wb', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', 'wp', '', 'br', '', '', ''],
			['', '', '', 'br', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '']
		];

		board = new Board('b', boardArray);
	});

	it('A rook can move any amount of spaces vertically or horizontally', () => {
		const selectedPiece = board.getPieceAt(5, 3);
		const turn = 'b';
		const expectedMoves = [
			[5, 0],
			[5, 1],
			[5, 2],
			[5, 4],
			[5, 5],
			[5, 6],
			[5, 7],
			[0, 3],
			[1, 3],
			[2, 3],
			[3, 3],
			[4, 3],
			[6, 3],
			[7, 3]
		];
		const resultMoves = board.findPossibleMoves(selectedPiece, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});

	it('A rook movement is limited by opponents pieces', () => {
		const selectedPiece = board.getPieceAt(4, 4);
		const turn = 'b';
		const expectedMoves = [
			[4, 2],
			[4, 3],
			[4, 5],
			[4, 6],
			[4, 7],
			[2, 4],
			[3, 4],
			[5, 4],
			[6, 4],
			[7, 4]
		];
		const resultMoves = board.findPossibleMoves(selectedPiece, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});

	it('A rook movement is limited the players own pieces', () => {
		const selectedPiece = board.getPieceAt(0, 0);
		const turn = 'w';
		const expectedMoves = [[0, 1]];
		const resultMoves = board.findPossibleMoves(selectedPiece, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});
});

describe('Find possible moves for a Bishop', () => {
	let board: Board;

	beforeEach(() => {
		// Set up the board
		const boardArray = [
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', 'wb', '', '', '', '', ''],
			['', '', 'bb', '', '', '', '', ''],
			['', 'wp', '', 'wp', '', '', '', ''],
			['', '', 'wb', '', '', '', '', ''],
			['', 'wp', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '']
		];

		board = new Board('b', boardArray);
	});

	it('A rook can move any amount of spaces diagonally', () => {
		const selectedPiece = board.getPieceAt(2, 2);
		const turn = 'w';
		const expectedMoves = [
			[0, 0],
			[1, 1],
			[3, 3],
			[4, 4],
			[5, 5],
			[6, 6],
			[7, 7],
			[0, 4],
			[1, 3],
			[3, 1],
			[4, 0]
		];
		const resultMoves = board.findPossibleMoves(selectedPiece, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});

	it('A rook movement is limited by opponents pieces', () => {
		const selectedPiece = board.getPieceAt(3, 2);
		const turn = 'b';
		const expectedMoves = [
			[2, 1],
			[1, 0],
			[2, 3],
			[1, 4],
			[0, 5],
			[4, 1],
			[4, 3]
		];
		const resultMoves = board.findPossibleMoves(selectedPiece, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});

	it('A rook movement is limited the players own pieces', () => {
		const selectedPiece = board.getPieceAt(5, 2);
		const turn = 'w';
		const expectedMoves = [
			[6, 3],
			[7, 4]
		];
		const resultMoves = board.findPossibleMoves(selectedPiece, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});
});

describe('Find possible moves for a Queen', () => {
	let board: Board;

	beforeEach(() => {
		// Set up the board
		const boardArray = [
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', 'bq', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '']
		];

		board = new Board('b', boardArray);
	});

	it('A Queen can move any amount of spaces in any direction', () => {
		const selectedPiece = board.getPieceAt(4, 3);
		const turn = 'b';
		const expectedMoves = [
			[3, 2],
			[2, 1],
			[1, 0],
			[5, 4],
			[6, 5],
			[7, 6],
			[5, 2],
			[6, 1],
			[7, 0],
			[3, 4],
			[2, 5],
			[1, 6],
			[0, 7],
			[4, 2],
			[4, 1],
			[4, 0],
			[4, 4],
			[4, 5],
			[4, 6],
			[4, 7],
			[0, 3],
			[1, 3],
			[2, 3],
			[3, 3],
			[5, 3],
			[6, 3],
			[7, 3]
		];
		const resultMoves = board.findPossibleMoves(selectedPiece, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});
});

describe('Find possible moves for a Knight', () => {
	let board: Board;

	beforeEach(() => {
		// Set up the board
		const boardArray = [
			['', '', '', '', '', '', '', ''],
			['', '', '', '', 'bb', '', '', ''],
			['', 'bp', '', '', '', '', '', ''],
			['', '', 'bn', 'wn', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', 'bp*', 'bp*', 'bp*', 'bp*'],
			['', '', '', '', 'bk', 'bb', 'bn', 'br']
		];

		board = new Board('b', boardArray);
	});

	it('A Knight only has 2 possible moves the first time it is moved', () => {
		const selectedPiece = board.getPieceAt(7, 6);
		const turn = 'b';
		const expectedMoves = [
			[5, 7],
			[5, 5]
		];
		const resultMoves = board.findPossibleMoves(selectedPiece, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});

	it('A Knight can capture in any L shape direction', () => {
		const selectedPiece = board.getPieceAt(3, 3);
		const turn = 'w';
		const expectedMoves = [
			[1, 2],
			[1, 4],
			[2, 1],
			[2, 5],
			[4, 1],
			[4, 5],
			[5, 2],
			[5, 4]
		];
		const resultMoves = board.findPossibleMoves(selectedPiece, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});

	it('A Knight can move in any L shape direction', () => {
		const selectedPiece = board.getPieceAt(3, 2);
		const turn = 'b';
		const expectedMoves = [
			[1, 1],
			[1, 3],
			[2, 0],
			[2, 4],
			[4, 0],
			[4, 4],
			[5, 1],
			[5, 3]
		];
		const resultMoves = board.findPossibleMoves(selectedPiece, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});
});

describe('Find possible moves for a King', () => {
	let board: Board;

	beforeEach(() => {
		// Set up the board
		const boardArray = [
			['', '', 'wb', 'wk', 'wq', '', '', ''],
			['', '', 'wp', '', 'wp', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['wb', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', 'wn', ''],
			['', 'wr', '', '', '', '', '', ''],
			['bk', '', '', '', 'bk', '', '', '']
		];

		board = new Board('b', boardArray);
	});

	it('A King can move one space in any direction', () => {
		const boardArray = [
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', 'bk', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '']
		];

		board = new Board('b', boardArray);

		const selectedPiece = board.getPieceAt(4, 3);
		const turn = 'b';
		const expectedMoves = [
			[3, 3],
			[3, 4],
			[4, 4],
			[5, 4],
			[5, 3],
			[5, 2],
			[4, 2],
			[3, 2]
		];
		const resultMoves = board.findPossibleMoves(selectedPiece, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});

	it('A King can capture a piece', () => {
		const selectedPiece = board.getPieceAt(7, 0);
		const turn = 'b';
		const expectedMove = [[6, 1]];
		const resultMoves = board.findPossibleMoves(selectedPiece, turn);

		expect(resultMoves).toEqual(expect.arrayContaining(expectedMove));
	});

	it('A King movement is limited by its own pieces', () => {
		const selectedPiece = board.getPieceAt(0, 3);
		const turn = 'w';
		const expectedMoves = [[1, 3]];
		const resultMoves = board.findPossibleMoves(selectedPiece, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});

	it('A King movement reduced by threatening pieces', () => {
		const selectedPiece = board.getPieceAt(7, 4);
		const turn = 'b';
		const expectedMoves = [[7, 3]];
		const resultMoves = board.findPossibleMoves(selectedPiece, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});

	it('A King movement reduced by threatening King', () => {
		const boardArray = [
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', 'wk', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', 'bk', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', 'wk', '', '', '', '', ''],
			['', '', '', '', '', '', '', '']
		];

		board = new Board('b', boardArray);
		
		const selectedPiece = board.getPieceAt(4, 3);
		const turn = 'b';
		const expectedMoves = [
			[4, 2],
			[4, 4],
			[5, 4]
		];
		const resultMoves = board.findPossibleMoves(selectedPiece, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});

	it('A King can escape check from a pawn by moving in from of the pawn', () => {
		const boardArray = [
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', 'wp', '', '', '', ''],
			['', 'wp', '', '', '', '', '', ''],
			['', '', '', 'bk', 'wp', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '']
		];

		board = new Board('b', boardArray);

		const selectedPiece = board.getPieceAt(4, 3);
		const turn = 'b';
		const expectedMoves = [
			[3, 3],
			[5, 2],
			[5, 4],
			[4, 4]
		];
		const resultMoves = board.findPossibleMoves(selectedPiece, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});
});
