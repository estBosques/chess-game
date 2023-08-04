<script lang="ts">
	import Square from '$lib/Square.svelte';
	import { findPossibleMoves } from '$utils/piece-movement';
	import '$src/styles/styles.scss';
	import RowDecoration from './RowDecoration.svelte';
	import ColumnDecoration from './ColumnDecoration.svelte';
	import Game from '$src/classes/Game';
	import { onMount } from 'svelte';

	// * means the pawn hasn't moved yet
	let board = [
		// ['wr', 'wn', 'wb', 'wq', '', 'wb', 'wn', 'wr'], // a
		// ['wp*', '', 'wp*', '', 'wp*', 'wp*', '', 'wp*'], // b
		// ['', 'wp', '', '', '', '', '', ''], // c
		// ['', '', 'bp', 'wp^', 'wk', '', 'wp', 'bp'], // d
		// ['', '', '', '', '', '', '', ''], // e
		// ['', '', 'bq', '', 'bk', '', '', ''], // f
		// ['', '', '', '', 'bp*', 'bp*', 'bp*', ''], // g
		// ['br', 'bn', 'bb', '', '', 'bb', 'bn', 'br'] // h
		['', '', '', '', '', '', '', ''],
			['wp*', '', '', '', '', '', '', ''],
			['', '', '', '', '', '', '', ''],
			['', '', 'wp', '', '', '', '', ''],
			['', '', '', 'bp', '', '', 'wp', 'bp^'],
			['', '', '', '', '', '', '', ''],
			['bp*', 'bp', '', '', '', 'wp', '', ''],
			['', 'bp*', '', '', '', 'bp*', '', '']
	];

	let game: Game;
	let isBlackPlayer = true;
	let isWhitePlayer = true;
	let turn = 'b';
	let selected: number[] = [];
	let possibleMoves: number[][] = [];

	onMount(() => {
		// game = new Game();
		game = new Game('b', 'w', board);
		game = game;
		console.log('🚀 ~ file: board.svelte:32 ~ onMount ~ game:', game);
	});

	function handleSelection(event: CustomEvent) {
		const selectedPos = event.detail.pos;
		removeHighlights();

		possibleMoves = game.selectSquare(selectedPos);
		console.log('🚀 ~ file: board.svelte:38 ~ handleSelection ~ possibleMoves:', possibleMoves);
		highlightPossibleMoves(possibleMoves);
		game = game;
	}

	function highlightPossibleMoves(possibleMoves: number[][]) {
		for (const position of possibleMoves) {
			game.markSquare(position);
		}
		console.log(game.board);
	}

	function removeHighlights() {
		console.log('🚀 ~ file: board.svelte:46 ~ removeHighlights ~ removeHighlights:');
		for (const position of possibleMoves) {
			game.markSquare(position, false);
		}
		possibleMoves = [];
	}
</script>

<div class="container board">
	<!-- Board decorations (letter row)  -->
	<RowDecoration />

	<!-- Board -->
	{#if game}
		{#each game.board.board as row, i}
			<div class="row mx-auto">
				<ColumnDecoration {i} />

				{#each row as square}
					<Square data={square} highlighted={square.isPossibleMove} on:selected={handleSelection} />
				{/each}

				<ColumnDecoration {i} />
			</div>
		{/each}
	{/if}

	<!-- Board decorations (letter row) -->
	<RowDecoration />
</div>

<style lang="scss">
</style>
