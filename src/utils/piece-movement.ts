/**
 * Finds the possible moves for a given piece on the board.
 *
 * @param pos - The current position of the piece.
 * @param piece - The type of the piece.
 * @param board - The current state of the board.
 * @param turn - The current turn.
 * @param isOpponent - Indicates if the piece belongs to the opponent.
 * @returns An array of possible moves.
 */
export function findPossibleMoves(pos: number[], board: string[][], turn: string): number[][] {
	// Array to store the possible moves
	let possibleMoves: number[][] = [];
	const piece = board[pos[0]][pos[1]][1];

	// Find the possible moves
	possibleMoves = calculateMovements(pos, board, turn, piece);
  // If the piece is a King, remove position that would result in a check
	if (piece == 'k') possibleMoves = removeDangerousMoves(possibleMoves, turn, board);

	return possibleMoves;
}

/**
 * Calculate possible movements for a given piece on the board.
 * 
 * @param {number[]} initialPos - The initial position of the piece.
 * @param {string[][]} board - The game board.
 * @param {string} turn - The current turn.
 * @param {string} piece - The type of piece.
 * @returns {number[][]} - The possible movements for the piece.
 */
function calculateMovements(
    initialPos: number[],
    board: string[][],
    turn: string,
    piece: string
): number[][] {
    const possibleMoves: number[][] = [];

    switch (piece) {
        case 'r':
            // Find straight moves in all four directions
            for (let i = -1; i < 2; i++) {
              for (let j = -1; j < 2; j++) {
                if (Math.abs(i + j) === 1)
                possibleMoves.push(...findStraightMoves(initialPos, i, j, board, turn));
              }              
            }
            break;
        case 'n':
            // Find knight moves
            possibleMoves.push(...findKnightMoves(initialPos, board, turn));
            break;
        case 'b':
            // Find diagonal moves in all four directions
            for (let i = -1; i < 2; i++) {
              for (let j = -1; j < 2; j++) {
                if (Math.abs(i * j) === 1)
                possibleMoves.push(...findStraightMoves(initialPos, i, j, board, turn));
              } 
            }
            break;
        case 'q':
            // Find queen moves
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if (i != 0 || j != 0)
                        possibleMoves.push(...findStraightMoves(initialPos, i, j, board, turn));
                }
            }
            break;
        case 'k':
            // Find king moves
            possibleMoves.push(...findKingMoves(initialPos, board, turn));
            break;
        case 'p':
            // Find pawn moves
            possibleMoves.push(...findPawnMoves(initialPos, board, turn));
            break;
    }

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

/**
 * Finds the possible moves for a king piece on the chessboard.
 * 
 * @param pos - The current position of the king as an array [vPos, hPos].
 * @param board - The chessboard represented as a 2D array of strings.
 * @param turn - The current player's turn represented as a string.
 * @returns An array of possible moves for the king as arrays [vPos, hPos].
 */
/**
 * Find the possible king moves on a chess board.
 * 
 * @param pos - The position of the king as an array of two numbers [vPos, hPos].
 * @param board - The chess board as a 2D array of strings.
 * @param turn - The current turn as a string.
 * @returns An array of possible moves as an array of two numbers [vPos, hPos].
 */
function findKingMoves(pos: number[], board: string[][], turn: string): [number, number][] {
    const possibleMoves: [number, number][] = [];

    const [initialVPos, initialHPos] = pos;

    for (let i = -2; i < 3; i++) {
        for (let j = -2; j < 3; j++) {
            const vPos = initialVPos + i;
            const hPos = initialHPos + j;

            // Check it's not out of bounds and it's not the current position
            if ((i !== 0 || j !== 0) && vPos >= 0 && vPos < 8 && hPos >= 0 && hPos < 8) {
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
            }
        }
    }

    return possibleMoves;
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

/**
 * Removes dangerous moves from the list of possible moves.
 * A move is considered dangerous if it results in the current player's piece being captured.
 *
 * @param {number[][]} possibleMoves - The list of possible moves.
 * @param {string} currentTurn - The current player's turn.
 * @param {string[][]} board - The game board.
 * @returns {number[][]} - The updated list of possible moves.
 */
function removeDangerousMoves(
  possibleMoves: number[][],
  currentTurn: string,
  board: string[][]
): number[][] {
  const opponent = currentTurn === 'b' ? 'w' : 'b';
  let pieceMovement: number[][] = [];

  // Iterate over each cell on the board
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      const cell = board[i][j];

      // Skip empty cells and cells that don't belong to the opponent
      if (cell === '' || cell[0] !== opponent) continue;

      // Calculate the possible movement for the opponent's piece
      pieceMovement = calculateMovements([i, j], board, opponent, cell[1]);

      // Filter out moves that would result in the opponent's piece being captured
      possibleMoves = possibleMoves.filter((move) => {
        const stringMove = JSON.stringify(move);
        const stringPieceMovement = JSON.stringify(pieceMovement);

        return !stringPieceMovement.includes(stringMove);
      });
    }
  }

  return possibleMoves;
}
