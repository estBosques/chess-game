<script lang="ts">
	import Square from '$lib/Square.svelte';
	import { findPossibleMoves } from '$utils/piece-movement';
	import '$src/styles/styles.scss';
	import RowDecoration from './RowDecoration.svelte';
	import ColumnDecoration from './ColumnDecoration.svelte';
	import Game from '$src/classes/Game';
	import { onMount } from 'svelte';

	export let showThreatMap = false;

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

	let game: Game;
	let isBlackPlayer = true;
	let isWhitePlayer = true;
	let turn = 'b';
	let selected: number[] = [];
	let possibleMoves: Map<string, number[]> = new Map();

	onMount(() => {
		// game = new Game();
		game = new Game('b', 'b', board);
		game = game;
	});

	$: {
		if (game && showThreatMap) {
			updateThreatMap();
		}
	}

	function updateThreatMap() {
		game.clearMarks();
		if (showThreatMap) {
			possibleMoves = new Map();
			possibleMoves = game.showThreatMap();
		} else possibleMoves = new Map();
	}

	function handleSelection(event: CustomEvent) {
		const selectedPos: number[] = event.detail.pos;
		removeHighlights();
		possibleMoves = game.selectSquare(selectedPos);
		
		game = game;
		game.board = game.board;
	}

	function removeHighlights() {
		game.clearMarks();

		game.board = game.board;
	}
</script>

<div class="container board">
	<!-- Board decorations (letter row)  -->
	<RowDecoration />

	<!-- Board -->
	{#if game}
		{#each game.board.board as row, i (i)}
			<div class="row mx-auto">
				<ColumnDecoration {i} />

				{#each row as square, j (j)}
					<Square
						bind:data={square}
						highlighted={possibleMoves.has(JSON.stringify([i, j]))}
						on:selected={handleSelection}
					/>
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
