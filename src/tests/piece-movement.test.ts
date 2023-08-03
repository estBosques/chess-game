import { expect, describe, it, beforeEach } from 'vitest';
import { findPossibleMoves } from '$src/utils/piece-movement';

describe('Find Possible moves for pawn', () => {
	let board: string[][];

	beforeEach(() => {
		// Set up the board
		board = [
			['', '', '', '', '', '', '', ''],
			['wp*', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', 'wp', '', '', '', '', ''],
			['', '', '', 'bp', '', '', 'wp', 'bp^'],
			['', '', '', '', '', '', '', ''],
			['bp*', 'bp', '', '', '', 'wp', '', ''],
			['', 'bp*', '', '', '', 'bp*', '', '']
		];
	});

	it('A pawn can move two spaces the first time it is moved', () => {
		const initialPos = [6, 0];
		const turn = 'b';
		const expectedMoves = [
			[4, 0],
			[5, 0]
		];
		expect(findPossibleMoves(initialPos, board, turn)).toEqual(
			expect.arrayContaining(expectedMoves)
		);
	});

	it("A pawn can't move two spaces if there's an opponent in front", () => {
		const initialPos = [7, 5];
		const turn = 'b';
		expect(findPossibleMoves(initialPos, board, turn)).toHaveLength(0);
	});

	it("A pawn can't move two spaces if there's a friendly piece in front", () => {
		const initialPos = [7, 1];
		const turn = 'b';
		expect(findPossibleMoves(initialPos, board, turn)).toHaveLength(0);
	});

	it('A pawn can capture a piece that moved to spaces the last turn (en passant rule)', () => {
		const initialPos = [4, 6];
		const turn = 'w';
		const expectedMoves = [
			[5, 6],
			[5, 7]
		];
		const resultMoves = findPossibleMoves(initialPos, board, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});

	it('A pawn can capture a piece that is diagonal to itself moving forward', () => {
		const initialPos = [3, 2];
		const turn = 'w';
		const expectedMoves = [
			[4, 2],
			[4, 3]
		];
		const resultMoves = findPossibleMoves(initialPos, board, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});
});

describe('Find possible moves for a Rook', () => {
	let board: string[][];

	beforeEach(() => {
		// Set up the board
		board = [
			['wr', '', 'wb', '', '', '', '', ''],
			['wp*', '', '', '', '', '', '', ''],
			['', '', '', '', 'wb', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', 'wp', '', 'br', '', '', ''],
			['', '', '', 'br', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '']
		];
	});

	it('A rook can move any amount of spaces vertically or horizontally', () => {
		const initialPos = [5, 3];
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
		const resultMoves = findPossibleMoves(initialPos, board, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});

	it('A rook movement is limited by opponents pieces', () => {
		const initialPos = [4, 4];
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
		const resultMoves = findPossibleMoves(initialPos, board, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});

	it('A rook movement is limited the players own pieces', () => {
		const initialPos = [0, 0];
		const turn = 'w';
		const expectedMoves = [[0, 1]];
		const resultMoves = findPossibleMoves(initialPos, board, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});
});

describe('Find possible moves for a Bishop', () => {
	let board: string[][];

	beforeEach(() => {
		// Set up the board
		board = [
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', 'wb', '', '', '', '', ''],
			['', '', 'bb', '', '', '', '', ''],
			['', 'wp', '', 'wp', '', '', '', ''],
			['', '', 'wb', '', '', '', '', ''],
			['', 'wp', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '']
		];
	});

	it('A rook can move any amount of spaces diagonally', () => {
		const initialPos = [2, 2];
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
		const resultMoves = findPossibleMoves(initialPos, board, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});

	it('A rook movement is limited by opponents pieces', () => {
		const initialPos = [3, 2];
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
		const resultMoves = findPossibleMoves(initialPos, board, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});

	it('A rook movement is limited the players own pieces', () => {
		const initialPos = [5, 2];
		const turn = 'w';
		const expectedMoves = [
			[6, 3],
			[7, 4]
		];
		const resultMoves = findPossibleMoves(initialPos, board, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});
});

describe('Find possible moves for a Queen', () => {
	let board: string[][];

	beforeEach(() => {
		// Set up the board
		board = [
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', 'bq', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '']
		];
	});

	it('A Queen can move any amount of spaces in any direction', () => {
		const initialPos = [4, 3];
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
		const resultMoves = findPossibleMoves(initialPos, board, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});
});

describe('Find possible moves for a Knight', () => {
	let board: string[][];

	beforeEach(() => {
		// Set up the board
		board = [
			['', '', '', '', '', '', '', ''],
			['', '', '', '', 'bb', '', '', ''],
			['', 'bp', '', '', '', '', '', ''],
			['', '', 'bn', 'wn', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', 'bp*', 'bp*', 'bp*', 'bp*'],
			['', '', '', '', 'bk', 'bb', 'bn', 'br']
		];
	});

	it('A Knight only has 2 possible moves the first time it is moved', () => {
		const initialPos = [7, 6];
		const turn = 'b';
		const expectedMoves = [
			[5, 7],
			[5, 5]
		];
		const resultMoves = findPossibleMoves(initialPos, board, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});

	it('A Knight can capture in any L shape direction', () => {
		const initialPos = [3, 3];
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
		const resultMoves = findPossibleMoves(initialPos, board, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});

	it('A Knight can move in any L shape direction', () => {
		const initialPos = [3, 2];
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
		const resultMoves = findPossibleMoves(initialPos, board, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});
});

describe('Find possible moves for a King', () => {
	let board: string[][];

	beforeEach(() => {
		// Set up the board
		board = [
			['', '', 'wb', 'wk', 'wq', '', '', ''],
			['', '', 'wp', '', 'wp', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['wb', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', 'wn', ''],
			['', 'wr', '', '', '', '', '', ''],
			['bk', '', '', '', 'bk', '', '', '']
		];
	});

	it('A King can move one space in any direction', () => {
		board = [
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', 'bk', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', '']
		];

		const initialPos = [4, 3];
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
		const resultMoves = findPossibleMoves(initialPos, board, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});

	it('A King can capture a piece', () => {
		const initialPos = [7, 0];
		const turn = 'b';
		const expectedMove = [[6, 1]];
		const resultMoves = findPossibleMoves(initialPos, board, turn);

		expect(resultMoves).toEqual(expect.arrayContaining(expectedMove));
	});

	it('A King movement is limited by its own pieces', () => {
		const initialPos = [0, 3];
		const turn = 'w';
		const expectedMoves = [[1, 3]];
		const resultMoves = findPossibleMoves(initialPos, board, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});

	it('A King movement reduced by threatening pieces', () => {
		const initialPos = [7, 4];
		const turn = 'b';
		const expectedMoves = [[7, 3]];
		const resultMoves = findPossibleMoves(initialPos, board, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});

	it('A King movement reduced by threatening King', () => {
		board = [
			['', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', 'wk', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', '', 'bk', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', 'wk', '', '', '', '', ''],
			['', '', '', '', '', '', '', '']
		];
		const initialPos = [4, 3];
		const turn = 'b';
		const expectedMoves = [
			[4, 2],
			[4, 4],
			[5, 4]
		];
		const resultMoves = findPossibleMoves(initialPos, board, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});

	it('A King can escape check from a pawn by moving in from of the pawn', () => {
		board = [
			['', ''  , '', ''  , '', '', '', ''],
			['', ''  , '', ''  , '', '', '', ''],
			['', ''  , '', 'wp', '', '', '', ''],
			['', 'wp', '', ''  , '', '', '', ''],
			['', ''  , '', 'bk', 'wp', '', '', ''],
			['', ''  , '', ''  , '', '', '', ''],
			['', ''  , '', ''  , '', '', '', ''],
			['', ''  , '', ''  , '', '', '', '']
		];

		const initialPos = [4, 3];
		const turn = 'b';
		const expectedMoves = [[3,3],[5,2],[5,4],[4,4]];
		const resultMoves = findPossibleMoves(initialPos, board, turn);

		expect(resultMoves).toHaveLength(expectedMoves.length);
		expect(resultMoves).toEqual(expect.arrayContaining(expectedMoves));
	});
});
