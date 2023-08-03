<script lang="ts">
	import '$src/styles/styles.scss';
	import type Pieces from '$interfaces/PieceDict';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let isDark = false;
	export let piece: string;
	export let key: number[];
	export let highlighted: boolean = false;

	const piecesDict: Pieces = {
		r: 'fa-chess-rook',
		n: 'fa-chess-knight',
		q: 'fa-chess-queen',
		b: 'fa-chess-bishop',
		p: 'fa-chess-pawn',
		k: 'fa-chess-king'
	};

	const color = piece[0] == 'b' ? 'black' : 'white';
	const icon = getIconClass(piece[1]);
	let isClicked = false;
	let highlightHovered = false;

	/**
	 * Returns the icon class for a given piece.
	 * @param {string} piece - The piece to get the icon class for.
	 * @returns {string} The icon class for the given piece.
	 */
	function getIconClass(piece: string): string {
		return piecesDict[piece];
	}

	/**
	 * Handles the click event.
	 * @param {boolean} state - The state of the click event.
	 */
	function onClick() {
		// Check if a piece is present
		if (piece !== '') {
			// Update the state of isClicked
			isClicked = true;

		}
    // Dispatch the 'selected' event with the position
    dispatch('selected', {
      pos: key
    });
	}

	function onHover() {
		if (highlighted) {
			highlightHovered = !highlightHovered;
		}
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
	class="col-1 d-flex align-items-center justify-content-center square {isDark ? 'dark' : 'light'} 
  {isClicked ? 'clicked' : ''}
  {highlighted ? 'highlight' : ''}
  {highlightHovered ? 'highlight-hovered' : ''}"
	on:mousedown={() => onClick()}
	on:mouseup={() => (isClicked = false)}
	on:mouseenter={() => onHover()}
  on:mouseleave={() => (highlightHovered = false)}
>
	{#if piece !== ''}
		<i class="fa-solid {icon} fa-2xl piece piece--{color}" />
	{/if}
</div>

<style lang="scss">
	.square {
		aspect-ratio: 1/1;

		width: var(--base-width);
		background-color: whitesmoke;
		border: 1px solid black;

		&.dark {
			background-color: black;
		}

		&.light {
			background-color: whitesmoke;
		}

		&.highlight {
			background-color: crimson;
		}

		&.highlight-hovered {
			background-color: forestgreen;
		}

		&.clicked {
			background-color: dodgerblue;
		}

		.piece {
			&--white {
				color: burlywood;
			}

			&--black {
				color: grey;
			}
		}
	}
</style>
