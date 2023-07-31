<script lang="ts">
	import Square from '$lib/Square.svelte';
	import '$src/styles/styles.scss';

	let board = Array(8).fill(Array(8).fill(''));
</script>

<div class="container board">
	<!-- Board decorations (letter row)  -->
	<div class="row decoration">
		{#each { length: 10 } as _, i}
			<span class="col-1 text-center decoration--letters">
				{' abcdefgh '[i]}
			</span>
		{/each}
	</div>

	<!-- Board -->
	{#each board as row, i}
		<div class="row">
			<span class="col-1 justify-content-end align-items-center d-flex decoration--numbers">{8 - i}</span>
    
			{#each row as square, j}
				<Square isDark={(i + j) % 2 === 1} />
			{/each}

			<span class="col-1 justify-content-start align-items-center d-flex decoration--numbers">{8 - i}</span>
		</div>
	{/each}

	<!-- Board decorations (letter row) -->
	<div class="row decoration">
		{#each { length: 10 } as _, i}
			<span class="col-1 text-center decoration--letters">
				{' abcdefgh '[i]}
			</span>
		{/each}
	</div>
</div>

<style lang="scss">
	.decoration {
		&--letters,
    &--numbers {
			width: var(--base-width);
		}
	}

	.board {
		aspect-ratio: 1/1;

		width: 100%;
	}
</style>
