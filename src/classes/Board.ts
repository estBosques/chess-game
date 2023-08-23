import Square from './Square';
import { PIECES, enumContainsValue } from '$src/utils/game-constants';
import type Options from '$interfaces/Options';

export default class Board {
	/**
	 * Represents a game board consisting of squares.
	 */
	private _board: Square[][];

	/**
	 * Represents the current player.
	 */
	private _player: string;

	/**
	 * Represents the opponent player.
	 */
	private _opponent: string;

	/**
	 * Represents the side of the board that belongs to the white player.
	 */
	private _whiteSide: number;

	private _direction = (color: string): number => {
		return color === 'w' ? this._whiteSide : -1 * this._whiteSide;
	};

	constructor(player = 'w', overrideBoard?: string[][]) {
		this._board = [];
		this._player = player;
		this._opponent = player === 'b' ? 'w' : 'b';
		this._whiteSide = player === 'w' ? -1 : 1;

		if (overrideBoard) this.generateBoardFromStringMatrix(overrideBoard);
		else this.resetBoard();
	}

	resetBoard() {
		const order = [
			PIECES.ROOK,
			PIECES.KNIGHT,
			PIECES.BISHOP,
			PIECES.QUEEN,
			PIECES.KING,
			PIECES.BISHOP,
			PIECES.KNIGHT,
			PIECES.ROOK
		];

		if (this._whiteSide === 1) order.reverse();

		const board: Square[][] = [];
		const pattern = this._whiteSide === 1 ? 0 : 1;

		for (let i = 0; i < 8; i++) {
			const row: Square[] = [];
			const pieceColor =
				(i < 2 && this._whiteSide === 1) || (i > 5 && this._whiteSide === -1) ? 'w' : 'b';

			for (let j = 0; j < 8; j++) {
				const squareColor = (i + j) % 2 === pattern;

				// If first or last row of the board
				if (i == 0 || i == 7) {
					row.push(new Square(squareColor, [i, j], order[j], pieceColor));
				} else if (i == 1 || i == 6) {
					row.push(new Square(squareColor, [i, j], PIECES.PAWN, pieceColor));
				} else {
					row.push(new Square(squareColor, [i, j]));
				}
			}
			board.push(row);
		}

		this._board = board;
	}

	get board(): Square[][] {
		return this._board;
	}

	set board(value: Square[][]) {
		this._board = value;
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

	/**
	 * Calculate possible movements for a given piece on the board.
	 *
	 * @param {Square} selectedPiece - The selected piece
	 * @param {string} turn - The current turn.
	 * @returns {number[][]} - The possible movements for the piece.
	 */
	calculateMovements(
		selectedPiece: Square,
		turn: string,
		skipKingPredictions = false
	): Map<string, number[]> {
		let possibleMoves: Map<string, number[]> = new Map();

		switch (selectedPiece.piece) {
			case PIECES.ROOK:
				// Find straight moves in all four directions
				for (let i = -1; i < 2; i++) {
					for (let j = -1; j < 2; j++) {
						if (Math.abs(i + j) === 1)
							possibleMoves = new Map([
								...possibleMoves,
								...this.findStraightMoves(selectedPiece, i, j, turn)
							]);
					}
				}
				break;
			case PIECES.KNIGHT:
				// Find knight moves
				possibleMoves = new Map([...possibleMoves, ...this.findKnightMoves(selectedPiece, turn)]);
				break;
			case PIECES.BISHOP:
				// Find diagonal moves in all four directions
				for (let i = -1; i < 2; i++) {
					for (let j = -1; j < 2; j++) {
						if (Math.abs(i * j) === 1)
							possibleMoves = new Map([
								...possibleMoves,
								...this.findStraightMoves(selectedPiece, i, j, turn)
							]);
					}
				}
				break;
			case PIECES.QUEEN:
				// Find queen moves
				for (let i = -1; i < 2; i++) {
					for (let j = -1; j < 2; j++) {
						if (i != 0 || j != 0)
							possibleMoves = new Map([
								...possibleMoves,
								...this.findStraightMoves(selectedPiece, i, j, turn)
							]);
					}
				}
				break;
			case PIECES.KING:
				// Find king moves
				possibleMoves = new Map([
					...possibleMoves,
					...this.findKingMoves(selectedPiece, turn, skipKingPredictions)
				]);
				break;
			case PIECES.PAWN:
				// Find pawn moves
				possibleMoves = new Map([...possibleMoves, ...this.findPawnMoves(selectedPiece, turn)]);
				break;
		}

		for (const move of possibleMoves.values()) {
			this.markSquare(move, { possibleMove: true });
		}

		return possibleMoves;
	}

	/**
	 * Finds all the straight moves from the initial position on the board.
	 *
	 * @param {Square} selectedPiece - The selected piece.
	 * @param {number} vDir - The vertical direction of movement (-1 for up, 1 for down, 0 for no movement).
	 * @param {number} hDir - The horizontal direction of movement (-1 for left, 1 for right, 0 for no movement).
	 * @param {string} turn - The current turn ('w' or 'b').
	 * @returns An array of possible moves as [vPos, hPos].
	 */
	findStraightMoves(
		selectedPiece: Square,
		vDir: number,
		hDir: number,
		turn: string
	): Map<string, number[]> {
		const possibleMoves: Map<string, number[]> = new Map();

		const [initialVPos, initialHPos] = selectedPiece.position;

		for (
			let vPos = initialVPos + vDir, hPos = initialHPos + hDir;
			vPos >= 0 && vPos < 8 && hPos >= 0 && hPos < 8;
			vPos += vDir, hPos += hDir
		) {
			// Check if the current position is empty or occupied by an opponent's piece
			if (this.board[vPos][hPos].isEmpty || this.board[vPos][hPos].isFromOpponent(turn)) {
				const pos = [vPos, hPos];
				possibleMoves.set(JSON.stringify(pos), pos);

				// Stop searching if an opponent's piece is encountered
				if (this.board[vPos][hPos].hasPiece && this.board[vPos][hPos].isFromOpponent(turn)) break;
			} else break; // Stop searching if own piece is encountered
		}

		return possibleMoves;
	}

	/**
	 * Finds all possible knight moves from a given position on the chessboard.
	 * @param {Square} selectedPiece - The selected piece
	 * @param {string} turn - The player's turn ('w' or 'b').
	 * @returns An array of all possible knight moves from the current position.
	 */
	findKnightMoves(selectedPiece: Square, turn: string): Map<string, number[]> {
		const possibleMoves: Map<string, number[]> = new Map();

		const [initialVPos, initialHPos] = selectedPiece.position;
		const directions = [
			[-1, -2],
			[-2, -1],
			[-2, 1],
			[-1, 2],
			[1, 2],
			[2, 1],
			[2, -1],
			[1, -2]
		];

		for (const direction of directions) {
			const vPos = initialVPos + direction[0];
			const hPos = initialHPos + direction[1];

			if (
				vPos >= 0 &&
				vPos < 8 &&
				hPos >= 0 &&
				hPos < 8 &&
				(this._board[vPos][hPos].isEmpty || this._board[vPos][hPos].isFromOpponent(turn)) // Check if the current position is empty or occupied by an opponent's piece
			) {
				const pos = [vPos, hPos];
				possibleMoves.set(JSON.stringify(pos), pos);
			}
		}

		return possibleMoves;
	}

	/**
	 * Find the possible king moves on a chess board.
	 *
	 * @param {Square} selectedPiece - The selected piece
	 * @param {string} turn - The current turn as a string.
	 * @returns An array of possible moves as an array of two numbers [vPos, hPos].
	 */
	findKingMoves(
		selectedPiece: Square,
		turn: string,
		skipKingPredictions = false
	): Map<string, number[]> {
		let possibleMoves: Map<string, number[]> = new Map();
		let dangerousMoves: Map<string, number[]> = new Map();
		let castlingMoves: Map<string, number[]> = new Map();

		if (!skipKingPredictions) {
			dangerousMoves = new Map([...this.listAllMovesFromOpponent(turn)]);
			castlingMoves = new Map([...this.findCastlingMoves(selectedPiece)]);
		}

		const [initialVPos, initialHPos] = selectedPiece.position;

		for (let i = -1; i < 2; i++) {
			for (let j = -2; j < 3; j++) {
				const vPos = initialVPos + i;
				const hPos = initialHPos + j;

				// Check it's not out of bounds and it's not the current position
				if ((i !== 0 || j !== 0) && vPos >= 0 && vPos < 8 && hPos >= 0 && hPos < 8) {
					// Look for possible moves inside valid range
					if (i <= 1 && i >= -1 && j <= 1 && j >= -1) {
						// Check if the target position is empty or occupied by an opponent's piece
						if (this._board[vPos][hPos].isEmpty || this._board[vPos][hPos].isFromOpponent(turn)) {
							const pos = [vPos, hPos];
							possibleMoves.set(JSON.stringify(pos), pos);
						}
					}
				}
			}
		}

		possibleMoves = this.removeDangerousMoves(possibleMoves, dangerousMoves);

		for (const move of castlingMoves.values()) {
			this.markSquare(move, { possibleMove: true, castling: true });
		}

		return possibleMoves;
	}

	/**
	 * Finds all possible moves for a pawn on a chessboard.
	 *
	 * @param {Square} selectedPiece - The selected piece
	 * @param {string} turn - The current turn ('b' for black, 'w' for white).
	 * @returns An array of possible moves represented as pairs of coordinates.
	 */
	findPawnMoves(selectedPiece: Square, turn: string): Map<string, number[]> {
		let possibleMoves: Map<string, number[]> = new Map();

		const [initialVPos, initialHPos] = selectedPiece.position;
		const wasMoved = selectedPiece.hasMoved; // This means that the pawn was moved 2 spaces in the previous turn

		const vDir = this._whiteSide * (turn === 'w' ? 1 : -1);

		if (initialVPos + vDir >= 0 && initialVPos + vDir < 8) {
			let targetSquare = this._board[initialVPos + vDir][initialHPos];

			// Regular one-space movement
			if (targetSquare.isEmpty) {
				const pos = [initialVPos + vDir, initialHPos];
				possibleMoves.set(JSON.stringify(pos), pos);

				targetSquare = this._board[initialVPos + vDir * 2][initialHPos];

				// Two spaces movement
				if (
					!wasMoved &&
					initialVPos + vDir * 2 >= 0 &&
					initialVPos + vDir * 2 < 8 &&
					targetSquare.isEmpty
				) {
					const pos = [initialVPos + vDir * 2, initialHPos];
					possibleMoves.set(JSON.stringify(pos), pos);
				}
			}
		}

		possibleMoves = new Map([
			...possibleMoves,
			...this.calculatePawnAttackMoves(selectedPiece, turn, vDir)
		]);

		return possibleMoves;
	}

	/**
	 * Calculates the possible pawn attack moves for a selected piece.
	 *
	 * @param {Square} selectedPiece - The square representing the selected piece.
	 * @param {string} turn - The current turn.
	 * @param {number} verticalDirection - The vertical movement direction of the pawn.
	 * @param {boolean} assumingCapture - Indicates whether the calculation assumes a capture or not. Default is false.
	 * @return {number[][]} An array of possible moves represented by their coordinates on the board.
	 */
	calculatePawnAttackMoves(
		selectedPiece: Square,
		turn: string,
		verticalDirection: number,
		assumingCapture = false
	): Map<string, number[]> {
		const [initialVPos, initialHPos] = selectedPiece.position;
		const possibleMoves: Map<string, number[]> = new Map();

		// Diagonal movement
		const hMovement = [-1, 1];
		for (const hDir of hMovement) {
			if (initialHPos + hDir < 0 || initialHPos + hDir >= 8) continue;
			const diagonalSquare = this._board[initialVPos + verticalDirection][initialHPos + hDir];
			const sideSquare = this._board[initialVPos][initialHPos + hDir];

			// If the target position is occupied by an opponent's piece
			if (assumingCapture || (diagonalSquare.hasPiece && diagonalSquare.isFromOpponent(turn))) {
				const pos = [initialVPos + verticalDirection, initialHPos + hDir];
				possibleMoves.set(JSON.stringify(pos), pos);
			}
			// En passant rule implementation
			else if (
				sideSquare.hasPiece && // There's a piece next to our piece
				sideSquare.isFromOpponent(turn) && // It's an opponent's piece
				sideSquare.enPassant
			) {
				// It's a pawn that was moved 2 spaces in the previous turn
				const pos = [initialVPos + verticalDirection, initialHPos + hDir];
				possibleMoves.set(JSON.stringify(pos), pos);
			}
		}
		return possibleMoves;
	}

	/**
	 * Find all possible moves for the current turn.
	 *
	 * @param {string} currentTurn - The current turn ('b' for black, 'w' for white).
	 * @return {number[][]} An array of arrays containing the possible moves for each piece.
	 */
	listAllMovesFromOpponent(currentTurn: string): Map<string, number[]> {
		const opponent = currentTurn === 'b' ? 'w' : 'b';
		const opponentDir = this._direction(opponent);
		let pieceMovement: Map<string, number[]> = new Map();

		// Iterate over each cell on the board
		for (let i = 0; i < this._board.length; i++) {
			for (let j = 0; j < this._board[i].length; j++) {
				const cell = this._board[i][j];

				// Skip empty cells and cells that don't belong to the opponent
				if (cell.isEmpty || cell.isFromOpponent(opponent)) continue;

				// Calculate the possible movement for the opponent's piece
				if (cell.piece === PIECES.PAWN)
					pieceMovement = new Map([
						...pieceMovement,
						...this.calculatePawnAttackMoves(cell, opponent, opponentDir, true)
					]);
				else
					pieceMovement = new Map([
						...pieceMovement,
						...this.calculateMovements(cell, opponent, true)
					]);
			}
		}

		return pieceMovement;
	}

	/**
	 * Removes dangerous moves from the list of possible moves.
	 *
	 * @param {number[][]} possibleMoves - The list of possible moves.
	 * @param {number[][]} dangerousMoves - The list of dangerous moves.
	 * @return {number[][]} The list of safe moves after filtering out dangerous moves.
	 */
	removeDangerousMoves(
		possibleMoves: Map<string, number[]>,
		dangerousMoves: Map<string, number[]>
	): Map<string, number[]> {
		// Filter out moves that would result in the opponent's piece being captured
		possibleMoves.forEach((move, key) => {
			if (dangerousMoves.has(key)) {
				possibleMoves.delete(key);
			}
		});

		return possibleMoves;
	}

	findCastlingMoves(
		selectedPiece: Square,
		dangerousMoves?: Map<string, number[]>
	): Map<string, number[]> {
		let possibleMoves: Map<string, number[]> = new Map();
		if (!dangerousMoves)
			dangerousMoves = new Map([...this.listAllMovesFromOpponent(selectedPiece.color)]);

		// Check if there are any rooks that can castle the king
		const validRooks = this.findValidRooks(selectedPiece);

		if (validRooks.length > 0) {
			const rookMoves = this.findCastlingPaths(selectedPiece, validRooks, dangerousMoves);
			possibleMoves = new Map([...possibleMoves, ...rookMoves]);
		}

		return possibleMoves;
	}

	/**
	 * Finds and returns the valid castling moves for the selected piece.
	 * It also validates the first 2 rules for castling:
	 *
	 * 	- Neither the king nor the rook has previously moved during the game.
	 * 	- There are no pieces between the king and the rook.
	 *
	 * @param {Square} selectedPiece - The selected piece to find castling moves for.
	 * @return {Square[]} An array of valid castling moves for the selected piece.
	 */
	findValidRooks(selectedPiece: Square): Square[] {
		if (selectedPiece.hasMoved) return [];

		const row = selectedPiece.position[0];
		const col = selectedPiece.position[1];
		const validRooks: Square[] = [];
		const boardRow = this._board[row];

		// Check to one side for obstacles
		for (let i = col + 1; i < 8; i++) {
			const square = boardRow[i];
			// If theres a piece before the end of the row, it cannot castle with this rook
			if (i !== 7 && square.hasPiece) break;
			// If not, check if it can castle with this rook
			else if (square.hasPiece && square.piece === PIECES.ROOK && !square.hasMoved) {
				validRooks.push(square);
			}
		}

		// Check to the other side for obstacles
		for (let i = col - 1; i >= 0; i--) {
			const square = boardRow[i];
			// If theres a piece before the end of the row, it cannot castle with this rook
			if (i !== 0 && square.hasPiece) break;
			// If not, check if it can castle with this rook
			else if (square.hasPiece && square.piece === PIECES.ROOK && !square.hasMoved) {
				validRooks.push(square);
			}
		}

		return validRooks;
	}

	findCastlingPaths(
		selectedPiece: Square,
		validRooks: Square[],
		dangerousMoves: Map<string, number[]>
	): Map<string, number[]> {
		const possibleMoves: Map<string, number[]> = new Map();

		for (const rook of validRooks) {
			const kingCol = selectedPiece.position[1];
			const rookCol = rook.position[1];

			const kingRow = selectedPiece.position[0];
			const rookRow = rook.position[0];

			let castlingPath: number[][];

			if (kingRow !== rookRow) {
				throw new Error('Invalid castling move. King and rook must be on the same row.');
			}

			if (rookCol > kingCol)
				castlingPath = [
					[kingRow, kingCol + 1],
					[kingRow, kingCol + 2]
				];
			else
				castlingPath = [
					[kingRow, kingCol - 1],
					[kingRow, kingCol - 2]
				];

			let castlingPathMap: Map<string, number[]> = new Map();
			castlingPath.forEach((pos) => {
				castlingPathMap.set(JSON.stringify(pos), pos);
			});

			castlingPathMap = this.removeDangerousMoves(castlingPathMap, dangerousMoves);

			if (castlingPath.length === 2)
				possibleMoves.set(JSON.stringify(castlingPath[1]), castlingPath[1]);
		}

		return possibleMoves;
	}

	/**
	 * Retrieves the piece at the specified coordinates on the board.
	 *
	 * @param {number} row - The row index of the desired piece.
	 * @param {number} col - The column index of the desired piece.
	 * @return {Square} The piece at the specified coordinates.
	 */
	getPieceAt(row: number, col: number): Square {
		return this._board[row][col];
	}

	/**
	 * Marks a square on the chessboard.
	 *
	 * @param {number[]} pos - The position of the square to mark.
	 * @param {Options} [options] - Optional options for marking the square. If missing, all marks are removed.
	 * @param {boolean} [options.possibleMove] - Whether the square is a possible move.
	 * @param {boolean} [options.castling] - Whether the square is a castling move.
	 * @return {void} This function does not return anything.
	 */
	markSquare(pos: number[], options?: Options): void {
		const piece = this.getPieceAt(pos[0], pos[1]);

		if (!options) this.markSquare(pos, { possibleMove: false, castling: false });
		else {
			if (options.possibleMove) piece.isPossibleMove = options.possibleMove;
			if (options.castling) piece.isCastlingMove = options.castling;
		}
	}

	movePiece(initialPos: number[], targetPos: number[]) {
		const movingPiece = this.getPieceAt(initialPos[0], initialPos[1]);
		const targetSquare = this.getPieceAt(targetPos[0], targetPos[1]);
		const movingTemp = movingPiece.toString();

		targetSquare.fromString(movingTemp);
		movingPiece.removePiece();

		movingPiece.hasMoved = true
	}

	/**
	 * Clears the board.
	 */
	clearBoard(): void {
		this._board = [];
	}

	/**
	 * Generates a board from a string matrix.
	 *
	 * @param {string[][]} board - The string matrix representing the board.
	 * @param {string} turn - The turn of the player, defaults to 'b'.
	 * @throws {Error} If the board is not 8x8, a default board is created.
	 * @throws {Error} If an invalid color or piece is found, a default board is created.
	 */
	generateBoardFromStringMatrix(board: string[][], turn = 'b') {
		if (board.length !== 8) {
			this.resetBoard();
			throw new Error('Board must be 8x8. Creating a default board.');
		}

		this._board = board.map((row, i) => {
			if (row.length !== 8) {
				this.resetBoard();
				throw new Error('Board must be 8x8. Creating a default board.');
			}
			return row.map((cell, j) => {
				const pattern = this._whiteSide === 1 ? 0 : 1;
				const isDarkSquare = (i + j) % 2 === pattern;

				if (cell.length > 0) {
					const color = cell[0];
					const piece = cell[1];
					const hasMoved = !cell.includes('*');
					const enPassant = cell.includes('^');

					if (color !== 'w' && color !== 'b') {
						this.resetBoard();
						throw new Error(
							`Invalid color, expected 'b' or 'w', but got: ${color}. Creating a default board.`
						);
					}

					if (!enumContainsValue(PIECES, piece)) {
						this.resetBoard();
						throw new Error(
							`Invalid piece, expected 'p', 'k', 'q', 'b', 'n' or 'r', but got: ${piece}. Creating a default board.`
						);
					}

					return new Square(isDarkSquare, [i, j], piece, color, hasMoved, enPassant);
				}

				return new Square(isDarkSquare, [i, j]);
			});
		});
	}

	/**
	 * Converts the board to a matrix of strings.
	 *
	 * @return {string[][]} The matrix representation of the board.
	 */
	convertBoardToStringMatrix(): string[][] {
		return this._board.map((row) =>
			row.map((square) => {
				return square.toString();
			})
		);
	}

	generateThreatMap(turn: string): Map<string, number[]> {
		const threatMap = new Map();
		console.log(this._board);
		for (const row of this._board) {
			for (const cell of row) {
				if (cell.hasPiece && cell.isFromTurn(turn)) {
					this.calculateMovements(cell, turn).forEach((move) => {
						const stringMove = JSON.stringify(move);
						if (!threatMap.has(stringMove)) threatMap.set(stringMove, move);
					});
				}
			}
		}

		return threatMap;
	}
}
