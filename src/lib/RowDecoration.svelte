<div class="row mx-auto decoration">
	{#each { length: 10 } as _, i}
		<span class="col-1 text-center decoration--letters">
			{' abcdefgh '[i]}
		</span>
	{/each}
</div>

<style lang="scss">
  .decoration {
		&--letters {
			width: var(--base-width);
		}
	}
</style>