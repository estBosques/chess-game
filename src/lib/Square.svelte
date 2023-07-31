<script lang="ts">
  import '$src/styles/styles.scss';

  export let isDark = false;
</script>

<div class="col-1 square {isDark ? 'dark' : 'light'}"></div>

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
  }
</style>