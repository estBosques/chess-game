/**
 * Finds the possible moves for a given piece on the board.
 *
 * @param pos - The current position of the piece.
 * @param piece - The type of the piece.
 * @param board - The current state of the board.
 * @param turn - The current turn.
 * @returns An array of possible moves.
 */
export function findPossibleMoves(
	pos: number[],
	piece: string,
	board: string[][],
	turn: string
): number[][] {
	// Array to store the possible moves
	const possibleMoves: number[][] = [];

	switch (piece[1]) {
		case 'r':
			// Find straight moves in all four directions
			possibleMoves.push(...findStraightMoves(pos, -1, 0, board, turn));
			possibleMoves.push(...findStraightMoves(pos, 0, 1, board, turn));
			possibleMoves.push(...findStraightMoves(pos, 1, 0, board, turn));
			possibleMoves.push(...findStraightMoves(pos, 0, -1, board, turn));
			break;
		case 'n':
			// Find knight moves
			possibleMoves.push(...findKnightMoves(pos, board, turn));
			break;
		case 'b':
			// Find diagonal moves in all four directions
			possibleMoves.push(...findStraightMoves(pos, -1, -1, board, turn));
			possibleMoves.push(...findStraightMoves(pos, -1, 1, board, turn));
			possibleMoves.push(...findStraightMoves(pos, 1, -1, board, turn));
			possibleMoves.push(...findStraightMoves(pos, 1, 1, board, turn));
			break;
		case 'q':
			// Find queen moves
			for (let i = -1; i < 2; i++) {
				for (let j = -1; j < 2; j++) {
					if (i != 0 || j != 0) possibleMoves.push(...findStraightMoves(pos, i, j, board, turn));
				}
			}
			break;
		case 'k':
			// Find king moves
			possibleMoves.push(...findKingMoves(pos, board, turn));
			break;
		case 'p':
			// Find pawn moves
			possibleMoves.push(...findPawnMoves(pos, board, turn));
			break;
	}

	// Print the possible moves to the console
	return possibleMoves;
}

/**
 * Finds all the straight moves from the initial position on the board.
 *
 * @param initialPos - The initial position on the board as an array [vPos, hPos].
 * @param vDir - The vertical direction of movement (-1 for up, 1 for down, 0 for no movement).
 * @param hDir - The horizontal direction of movement (-1 for left, 1 for right, 0 for no movement).
 * @param board - The current state of the board as a 2D array of strings.
 * @param turn - The current turn ('white' or 'black').
 * @returns An array of possible moves as [vPos, hPos].
 */
function findStraightMoves(
	initialPos: number[],
	vDir: number,
	hDir: number,
	board: string[][],
	turn: string
): number[][] {
	const possibleMoves: number[][] = [];

	const [initialVPos, initialHPos] = initialPos;

	for (
		let vPos = initialVPos + vDir, hPos = initialHPos + hDir;
		vPos >= 0 && vPos < 8 && hPos >= 0 && hPos < 8;
		vPos += vDir, hPos += hDir
	) {
		// Check if the current position is empty or occupied by an opponent's piece
		if (board[vPos][hPos] === '' || board[vPos][hPos][0] !== turn) {
			possibleMoves.push([vPos, hPos]);

			// Stop searching if an opponent's piece is encountered
			if (board[vPos][hPos] !== '' && board[vPos][hPos][0] !== turn) break;
		} else {
			// Stop searching if own piece is encountered
			break;
		}
	}

	return possibleMoves;
}

/**
 * Finds all possible knight moves from a given position on the chessboard.
 * @param pos - The current position of the knight as an array [vPos, hPos].
 * @param board - The chessboard represented as a 2D array of strings.
 * @param turn - The player's turn ('white' or 'black').
 * @returns An array of all possible knight moves from the current position.
 */
function findKnightMoves(pos: number[], board: string[][], turn: string): number[][] {
	const possibleMoves: number[][] = [];

	const [initialVPos, initialHPos] = pos;
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
			(board[vPos][hPos] === '' || board[vPos][hPos][0] !== turn) // Check if the current position is empty or occupied by an opponent's piece
		) {
			possibleMoves.push([vPos, hPos]);
		}
	}

	return possibleMoves;
}

function findKingMoves(pos: number[], board: string[][], turn: string): number[][] {
	const possibleMoves: number[][] = [];
	const bannedMoves: number[][] = [];

	const [initialVPos, initialHPos] = pos;

	for (let i = -2; i < 3; i++) {
		for (let j = -2; j < 3; j++) {
			const vPos = initialVPos + i;
			const hPos = initialHPos + j;

			// Check it's not out of bounds and it's not the current position
			if ((i != 0 || j != 0) && vPos >= 0 && vPos < 8 && hPos >= 0 && hPos < 8) {
				// Look for possible moves inside valid range
				if (i <= 1 && i >= -1 && j <= 1 && j >= -1) {
					// Check if the target position is empty or occupied by an opponent's piece
					if (
						board[vPos][hPos] === '' ||
						(board[vPos][hPos][0] !== turn && board[vPos][hPos][1] !== 'k')
					) {
						possibleMoves.push([vPos, hPos]);
					}
				}
				// Check if there's a king near the target position
				else {
					if (board[vPos][hPos] !== '' && board[vPos][hPos][1] === 'k') {
						const bannedVPos = initialVPos + Math.ceil(i / 2);
						const bannedHPos = initialHPos + Math.ceil(j / 2);
						bannedMoves.push([bannedVPos, bannedHPos]);

						if (i % 2 !== 0 && j % 2 !== 0) {
							bannedMoves.push([bannedVPos - 1, bannedHPos - 1]);
						} else if (i % 2 !== 0) {
							bannedMoves.push([bannedVPos - 1, bannedHPos]);
						} else if (j % 2 !== 0) {
							bannedMoves.push([bannedVPos, bannedHPos - 1]);
						}

						if (i == 0) {
							bannedMoves.push([bannedVPos + 1, bannedHPos]);
							bannedMoves.push([bannedVPos - 1, bannedHPos]);
						} else if (j == 0) {
							bannedMoves.push([bannedVPos, bannedHPos + 1]);
							bannedMoves.push([bannedVPos, bannedHPos - 1]);
						}
					}
				}
			}
		}
	}
  // TODO: Add banned moves based on other pieces
	let stringfiedMoves = JSON.stringify(possibleMoves);
	for (const bannedMove of bannedMoves) {
		if (stringfiedMoves.includes(JSON.stringify(bannedMove))) {
			stringfiedMoves = stringfiedMoves.replace(JSON.stringify(bannedMove), '');
		}

		stringfiedMoves = stringfiedMoves
			.replaceAll(',,', ',')
			.replaceAll('[,[', '[[')
			.replaceAll('],]', ']]');
	}

  return JSON.parse(stringfiedMoves);
}

/**
 * Finds all possible moves for a pawn on a chessboard.
 *
 * @param initialPos - The initial position of the pawn.
 * @param board - The chessboard represented as a 2D array of strings.
 * @param turn - The current turn ('b' for black, 'w' for white).
 * @returns An array of possible moves represented as pairs of coordinates.
 */
function findPawnMoves(initialPos: number[], board: string[][], turn: string): number[][] {
	const possibleMoves: number[][] = [];

	const [initialVPos, initialHPos] = initialPos;
	const piece = board[initialVPos][initialHPos];
	const wasMoved = piece.length === 2 || piece[2] === '^'; // ^ means that the pawn was moved 2 spaces in the previous turn

	const vDir = turn === 'b' ? -1 : 1;

	// Two spaces movement
	if (
		!wasMoved &&
		initialVPos + vDir * 2 >= 0 &&
		initialVPos + vDir * 2 < 8 &&
		board[initialVPos + vDir * 2][initialHPos] === ''
	) {
		possibleMoves.push([initialVPos + vDir * 2, initialHPos]);
	}

	if (initialVPos + vDir >= 0 && initialVPos + vDir < 8) {
		// Regular one-space movement
		if (board[initialVPos + vDir][initialHPos] === '') {
			possibleMoves.push([initialVPos + vDir, initialHPos]);
		}

		// Diagonal movement
		const hMovement = [-1, 1];
		for (const hDir of hMovement) {
			if (initialHPos + hDir < 0 || initialHPos + hDir >= 8) continue;

			// If the target position is occupied by an opponent's piece
			if (
				board[initialVPos + vDir][initialHPos + hDir] !== '' &&
				board[initialVPos + vDir][initialHPos + hDir][0] !== turn
			) {
				possibleMoves.push([initialVPos + vDir, initialHPos + hDir]);
			}
			// En passant rule implementation
			else if (
				board[initialVPos][initialHPos + hDir] !== '' && // There's a piece next to our piece
				board[initialVPos][initialHPos + hDir][0] !== turn && // It's an opponent's piece
				board[initialVPos][initialHPos + hDir].slice(1) === 'p^'
			) {
				// It's a pawn that was moved 2 spaces in the previous turn
				possibleMoves.push([initialVPos + vDir, initialHPos + hDir]);
			}
		}
	}

	return possibleMoves;
}
