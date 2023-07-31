<script lang="ts">
	import Square from '$lib/Square.svelte';
	import '$src/styles/styles.scss';

	let board = 
  [
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'], // a
    ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'], // b
    ['', '', '', '', '', '', '', ''], // c
    ['', '', '', '', '', '', '', ''], // d
    ['', '', '', '', '', '', '', ''], // e
    ['', '', '', '', '', '', '', ''], // f
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'], // g
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'] // h
  ]
</script>

<div class="container board">
	<!-- Board decorations (letter row)  -->
	<div class="row mx-auto decoration">
		{#each { length: 10 } as _, i}
			<span class="col-1 text-center decoration--letters">
				{' abcdefgh '[i]}
			</span>
		{/each}
	</div>

	<!-- Board -->
	{#each board as row, i}
		<div class="row mx-auto ">
			<span class="col-1 justify-content-end align-items-center d-flex decoration--numbers">{8 - i}</span>
    
			{#each row as square, j}
				<Square isDark={(i + j) % 2 === 1} piece={square}/>
			{/each}

			<span class="col-1 justify-content-start align-items-center d-flex decoration--numbers">{8 - i}</span>
		</div>
	{/each}

	<!-- Board decorations (letter row) -->
	<div class="row mx-auto decoration">
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
</style>
