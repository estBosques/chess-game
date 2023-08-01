<script lang="ts">
	import Square from '$lib/Square.svelte';
	import { findPossibleMoves } from '$utils/piece-movement';
	import '$src/styles/styles.scss';
	import RowDecoration from './RowDecoration.svelte';
	import ColumnDecoration from './ColumnDecoration.svelte';

	// * means the pawn hasn't moved yet
	let board = [
		['wr', 'wn', 'wb', 'wq', '', 'wb', 'wn', 'wr'], // a
		['wp*', '', 'wp*', '', 'wp*', 'wp*', '', 'wp*'], // b
		['', 'wp', '', '', '', '', '', ''], // c
		['', '', 'bp', 'wp^', 'wk', '', 'wp', 'bp'], // d
		['', '', '', '', '', '', '', ''], // e
		['', '', 'bq', '', 'bk', '', '', ''], // f
		['', '', '', '', 'bp*', 'bp*', 'bp*', ''], // g
		['br', 'bn', 'bb', '', '', 'bb', 'bn', 'br'] // h
	];

	let isBlackPlayer = true;
	let isWhitePlayer = true;
	let turn = 'b';
	let selected: number[] = [];
	let possibleMoves: number[][] = [];

	function handleSelection(event: CustomEvent) {
		const selectedPos = event.detail.pos;

		const selectedPiece = board[selectedPos[0]][selectedPos[1]];

		if (selectedPiece !== '' && selectedPiece[0] === turn) {
			removeHighlights();
			possibleMoves = findPossibleMoves(selectedPos, selectedPiece, board, turn);
      highlightPossibleMoves(possibleMoves);
		}
	}

	function highlightPossibleMoves(possibleMoves: number[][]) {
		for (const position of possibleMoves) {
			board[position[0]][position[1]] = board[position[0]][position[1]] + '?';
		}
		console.log(board);
	}

	function removeHighlights() {
		for (let i = 0; i < board.length; i++) {
			for (let j = 0; j < board[i].length; j++) {
				if (board[i][j].includes('?')) {
					board[i][j] = board[i][j].replace('?', '');
					console.log('🚀 ~ file: board.svelte:66 ~ removeHighlights ~ board[i][j]:', board[i][j]);
				}
			}
		}
	}
</script>

<div class="container board">
	<!-- Board decorations (letter row)  -->
	<RowDecoration />

	<!-- Board -->
	{#each board as row, i}
		<div class="row mx-auto">
			<ColumnDecoration {i} />

			{#each row as square, j}
				<Square
					isDark={(i + j) % 2 === 1}
					piece={square}
					key={[i, j]}
					highlighted={board[i][j].includes('?')}
					on:selected={handleSelection}
				/>
			{/each}

			<ColumnDecoration {i} />
		</div>
	{/each}

	<!-- Board decorations (letter row) -->
	<RowDecoration />
</div>

<style lang="scss">
</style>
