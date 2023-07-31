<script lang="ts">
	import '$src/styles/styles.scss';
	import type Pieces from '$interfaces/PieceDict';

	export let isDark = false;
	export let piece: string;

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

	/**
	 * Returns the icon class for a given piece.
	 * @param piece - The piece to get the icon class for.
	 * @returns The icon class for the given piece.
	 */
	function getIconClass(piece: string): string {
		return piecesDict[piece];
	}

	let isClicked = false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="col-1 d-flex align-items-center justify-content-center square {isDark ? 'dark' : 'light'} 
  {isClicked ? 'clicked' : ''}"
	on:mousedown={() => (isClicked = true)}
	on:mouseup={() => (isClicked = false)}
>
	<i class="fa-solid {icon} fa-2xl piece piece--{color}" />
</div>

<style lang="scss">
	.square {
		aspect-ratio: 1/1;

		width: var(--base-width);
		background-color: whitesmoke;

		&.dark {
			background-color: black;
		}

		&.light {
			background-color: whitesmoke;
		}

		&.clicked {
			background-color: crimson;
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
