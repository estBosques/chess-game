<script lang="ts">
	import '$src/styles/styles.scss';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import type Pieces from '$interfaces/PieceDict';
	import { createEventDispatcher } from 'svelte';
	import type Square from '$src/classes/Square';

	const dispatch = createEventDispatcher();

	export let data: Square;
	export let highlighted: boolean = false;

	const piecesDict: Pieces = {
		r: 'fa-chess-rook',
		n: 'fa-chess-knight',
		q: 'fa-chess-queen',
		b: 'fa-chess-bishop',
		p: 'fa-chess-pawn',
		k: 'fa-chess-king'
	};

	let icon = getIconClass(data.piece);
	let isClicked = false;
	let highlightHovered = false;

	$: {
		icon = getIconClass(data.piece);
		icon = icon === undefined ? '' : icon;
	}

	/**
	 * Returns the icon class for a given piece.
	 * @param {string} piece - The piece to get the icon class for.
	 * @returns {string} The icon class for the given piece.
	 */
	function getIconClass(piece: string): string {
		const icon = piecesDict[piece];

		return icon === undefined ? '' : icon;
	}

	/**
	 * Handles the click event. */
	function onClick() {
		// Check if a piece is present
		if (data.hasPiece) {
			// Update the state of isClicked
			isClicked = true;
		}
		// Dispatch the 'selected' event with the position
		dispatch('selected', {
			pos: data.position
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
	class="col-1 d-flex align-items-center justify-content-center square {data.isDarkSquare
		? 'dark'
		: 'light'} 
  {isClicked ? 'clicked' : ''}
  {highlighted ? 'highlight' : ''}
  {highlightHovered ? 'highlight-hovered' : ''}"
	on:mousedown={() => onClick()}
	on:mouseup={() => (isClicked = false)}
	on:mouseenter={() => onHover()}
	on:mouseleave={() => (highlightHovered = false)}
>
		<i class="fa-solid {icon} fa-2xl piece piece--{data.color}" />
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
			&--w {
				color: burlywood;
			}

			&--b {
				color: grey;
			}
		}
	}
</style>
