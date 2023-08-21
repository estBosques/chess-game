<script>
	import Board from '$lib/Board.svelte';

	let showThreatMap = false;
  let message = 'Show';

	function toggleThreatMap() {
		showThreatMap = !showThreatMap;
	}

  $: {
    message = showThreatMap ? 'Hide' : 'Show';
  }
  
</script>

<div>
	<div class="container col-6 vh-100 d-flex align-items-center">
		<Board {showThreatMap} />
	</div>
	<button type="button" on:click={toggleThreatMap}>{message} threatmap</button>
</div>
