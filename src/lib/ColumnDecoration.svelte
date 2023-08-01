<script lang="ts">
	export let i: number;
</script>

<span class="col-1 justify-content-start align-items-center d-flex decoration--numbers">
	{8 - i}
</span>

<style lang="scss">
	.decoration {
		&--numbers {
			width: var(--base-width);
		}
	}
</style>
