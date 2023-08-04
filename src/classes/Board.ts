import Square from './Square';
import { PIECES, enumContainsValue } from '$src/utils/game-constants';

export default class Board {
	private _board: Square[][];
	private _player: string;
	private _opponent: string;
	private _whitePos: number

	constructor(player = 'w', overrideBoard?: string[][]) {
		this._board = [];
		this._player = player;
		this._opponent = player === 'b' ? 'w' : 'b';
		this._whitePos = player === 'w' ? -1 : 1

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

		const board: Square[][] = [];
		const pattern = this._whitePos === -1 ? 0 : 1;

		for (let i = 0; i < 8; i++) {
			const row: Square[] = [];
			for (let j = 0; j < 8; j++) {
				const squareColor = (i + j) % 2 === pattern;

				// If first or last row of the board
				if (i == 0 || i == 7) {
					const pieceColor = i == 7 ? this._player : this._opponent;

					if (this._whitePos === 1) {
						// If the player is black, switch the Queen and King
						if (order[j] === PIECES.QUEEN) {
							row.push(new Square(squareColor, [i, j], PIECES.KING, pieceColor));
						} else if (order[j] === PIECES.KING) {
							row.push(new Square(squareColor, [i, j], PIECES.QUEEN, pieceColor));
						} else {
							row.push(new Square(squareColor, [i, j], order[j], pieceColor));
						}
					} else {
						row.push(new Square(squareColor, [i, j], order[j], pieceColor));
					}
				} else if (i == 1 || i == 6) {
					const pieceColor = i == 6 ? this._player : this._opponent;

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
	 * Finds the possible moves for a given piece on the board.
	 *
	 * @param selectedPiece - The selected piece.
	 * @param turn - The current turn.
	 * @returns An array of possible moves.
	 */
	findPossibleMoves(selectedPiece: Square, turn: string): number[][] {
		// Array to store the possible moves
		let possibleMoves: number[][] = [];

		if (selectedPiece.hasPiece) {
			// Find the possible moves
			possibleMoves = this.calculateMovements(selectedPiece, turn);
			// If the piece is a King, remove position that would result in a check
			if (selectedPiece.piece == PIECES.KING)
				// TODO: Call castling logic here, after getting dangerousMoves
				//				rule: The king is not in check and does not pass through or finish on a square attacked by an enemy piece
				possibleMoves = this.removeDangerousMoves(possibleMoves, turn);
		}
		console.log(
			'🚀 ~ file: Board.ts:101 ~ Board ~ findPossibleMoves ~ possibleMoves:',
			possibleMoves
		);
		return possibleMoves;
	}

	/**
	 * Calculate possible movements for a given piece on the board.
	 *
	 * @param {Square} selectedPiece - The selected piece
	 * @param {string} turn - The current turn.
	 * @returns {number[][]} - The possible movements for the piece.
	 */
	calculateMovements(selectedPiece: Square, turn: string): number[][] {
		const possibleMoves: number[][] = [];

		switch (selectedPiece.piece) {
			case PIECES.ROOK:
				// Find straight moves in all four directions
				for (let i = -1; i < 2; i++) {
					for (let j = -1; j < 2; j++) {
						if (Math.abs(i + j) === 1)
							possibleMoves.push(...this.findStraightMoves(selectedPiece, i, j, turn));
					}
				}
				break;
			case PIECES.KNIGHT:
				// Find knight moves
				possibleMoves.push(...this.findKnightMoves(selectedPiece, turn));
				break;
			case PIECES.BISHOP:
				// Find diagonal moves in all four directions
				for (let i = -1; i < 2; i++) {
					for (let j = -1; j < 2; j++) {
						if (Math.abs(i * j) === 1)
							possibleMoves.push(...this.findStraightMoves(selectedPiece, i, j, turn));
					}
				}
				break;
			case PIECES.QUEEN:
				// Find queen moves
				for (let i = -1; i < 2; i++) {
					for (let j = -1; j < 2; j++) {
						if (i != 0 || j != 0)
							possibleMoves.push(...this.findStraightMoves(selectedPiece, i, j, turn));
					}
				}
				break;
			case PIECES.KING:
				// Find king moves
				possibleMoves.push(...this.findKingMoves(selectedPiece, turn));
				break;
			case PIECES.PAWN:
				// Find pawn moves
				possibleMoves.push(...this.findPawnMoves(selectedPiece, turn));
				break;
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
	findStraightMoves(selectedPiece: Square, vDir: number, hDir: number, turn: string): number[][] {
		const possibleMoves: number[][] = [];

		const [initialVPos, initialHPos] = selectedPiece.position;

		for (
			let vPos = initialVPos + vDir, hPos = initialHPos + hDir;
			vPos >= 0 && vPos < 8 && hPos >= 0 && hPos < 8;
			vPos += vDir, hPos += hDir
		) {
			// Check if the current position is empty or occupied by an opponent's piece
			if (this.board[vPos][hPos].isEmpty || this.board[vPos][hPos].isFromOpponent(turn)) {
				possibleMoves.push([vPos, hPos]);

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
	findKnightMoves(selectedPiece: Square, turn: string): number[][] {
		const possibleMoves: number[][] = [];

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
				possibleMoves.push([vPos, hPos]);
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
	findKingMoves(selectedPiece: Square, turn: string): [number, number][] {
		const possibleMoves: [number, number][] = [];

		const [initialVPos, initialHPos] = selectedPiece.position;

		// TODO: Add Castling logic
		for (let i = -2; i < 3; i++) {
			for (let j = -2; j < 3; j++) {
				const vPos = initialVPos + i;
				const hPos = initialHPos + j;

				// Check it's not out of bounds and it's not the current position
				if ((i !== 0 || j !== 0) && vPos >= 0 && vPos < 8 && hPos >= 0 && hPos < 8) {
					// Look for possible moves inside valid range
					if (i <= 1 && i >= -1 && j <= 1 && j >= -1) {
						// Check if the target position is empty or occupied by an opponent's piece
						if (this._board[vPos][hPos].isEmpty || this._board[vPos][hPos].isFromOpponent(turn)) {
							possibleMoves.push([vPos, hPos]);
						}
					}
				}
			}
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
	findPawnMoves(selectedPiece: Square, turn: string): number[][] {
		const possibleMoves: number[][] = [];

		const [initialVPos, initialHPos] = selectedPiece.position;
		const wasMoved = selectedPiece.hasMoved; // This means that the pawn was moved 2 spaces in the previous turn

		// TODO: Change this for another flag, if 'b' is on top of the screen this doesn't work anymore
		const vDir = this._whitePos * (turn === 'w' ? 1 : -1);

		if (initialVPos + vDir >= 0 && initialVPos + vDir < 8) {
			let targetSquare = this._board[initialVPos + vDir][initialHPos];

			// Regular one-space movement
			if (targetSquare.isEmpty) {
				possibleMoves.push([initialVPos + vDir, initialHPos]);

				targetSquare = this._board[initialVPos + vDir * 2][initialHPos];
				console.log("🚀 ~ file: Board.ts:304 ~ Board ~ findPawnMoves ~ targetSquare:", selectedPiece)

				// Two spaces movement
				if (
					!wasMoved &&
					initialVPos + vDir * 2 >= 0 &&
					initialVPos + vDir * 2 < 8 &&
					targetSquare.isEmpty
				) {
					console.log("🚀 ~ file: Board.ts:313 ~ Board ~ findPawnMoves ~ !wasMoved:", !wasMoved)
					possibleMoves.push([initialVPos + vDir * 2, initialHPos]);
				}
			}
		}

		possibleMoves.push(...this.calculatePawnAttackMoves(selectedPiece, turn, vDir));

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
	): number[][] {
		const [initialVPos, initialHPos] = selectedPiece.position;
		const possibleMoves: number[][] = [];

		// Diagonal movement
		const hMovement = [-1, 1];
		for (const hDir of hMovement) {
			if (initialHPos + hDir < 0 || initialHPos + hDir >= 8) continue;
			const diagonalSquare = this._board[initialVPos + verticalDirection][initialHPos + hDir];
			const sideSquare = this._board[initialVPos][initialHPos + hDir];

			// If the target position is occupied by an opponent's piece
			if (assumingCapture || (diagonalSquare.hasPiece && diagonalSquare.isFromOpponent(turn))) {
				possibleMoves.push([initialVPos + verticalDirection, initialHPos + hDir]);
			}
			// En passant rule implementation
			else if (
				sideSquare.hasPiece && // There's a piece next to our piece
				sideSquare.isFromOpponent(turn) && // It's an opponent's piece
				sideSquare.enPassant
			) {
				// It's a pawn that was moved 2 spaces in the previous turn
				possibleMoves.push([initialVPos + verticalDirection, initialHPos + hDir]);
			}
		}
		return possibleMoves;
	}

	/**
	 * Removes dangerous moves from the list of possible moves.
	 * A move is considered dangerous if it results in the current player's piece being captured.
	 *
	 * @param {number[][]} possibleMoves - The list of possible moves.
	 * @param {string} currentTurn - The current player's turn.
	 * @returns {number[][]} - The updated list of possible moves.
	 */
	removeDangerousMoves(possibleMoves: number[][], currentTurn: string): number[][] {
		const opponent = currentTurn === 'b' ? 'w' : 'b';
		const opponentDir = opponent === 'b' ? -1 : 1;
		let pieceMovement: number[][] = [];

		// Iterate over each cell on the board
		for (let i = 0; i < this._board.length; i++) {
			for (let j = 0; j < this._board[i].length; j++) {
				const cell = this._board[i][j];

				// Skip empty cells and cells that don't belong to the opponent
				if (cell.isEmpty || cell.isFromOpponent(opponent)) continue;

				// Calculate the possible movement for the opponent's piece
				if (cell.piece === PIECES.PAWN)
					pieceMovement = this.calculatePawnAttackMoves(cell, opponent, opponentDir, true);
				else pieceMovement = this.calculateMovements(cell, opponent);

				// Filter out moves that would result in the opponent's piece being captured
				possibleMoves = possibleMoves.filter((move) => {
					const stringMove = JSON.stringify(move);
					const stringPieceMovement = JSON.stringify(pieceMovement);

					if (!stringPieceMovement.includes(stringMove)) {
						return true;
					}
					// if (cell[1] === 'p' && move[0] === i + opponentDir && move[1] === j) {
					// 	return true;
					// }
					return false;
				});
			}
		}

		return possibleMoves;
	}

	getPieceAt(row: number, col: number): Square {
		return this._board[row][col];
	}

	clearBoard() {
		this._board = [];
	}

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
				const pattern = turn === 'w' ? 0 : 1;
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

	convertBoardToStringMatrix(): string[][] {
		return this._board.map((row) => row.map((square) => {
			return square.toString();
		}));
	}
}
