# Project setup

## Bootstrap setup

For this project I chose to use a Node module approach.
- Install it using `npm i --save bootstrap @popperjs/core`
- Install sass with `npm i --save-dev sass`
- Add an alias to `vite.config.ts` file so it looks like this:
  ```js
  export default defineConfig({
    plugins: [sveltekit()],
    resolve: {
      alias: {
        '$lib': 'src/lib',
        '~bootstrap': 'node_modules/bootstrap'
      }
    }
  });
  ```
- Import bootstrap. For this, I created a new file `src/styles/styles.scss` and imported it there. I'll use this file for global styles. Importing bottstrap like this will import all styles from bootstrap, I'll have to update this and select only the necessary components.
  ```scss
  @import '~bootstrap/scss/bootstrap';
  ```

## Alias

Just like I did with bootstrap, I'll create some alias in `svelte.config.js`. To do this, I updated the kit property by adding a `alias` entry:
```js
alias: {
  $lib: './src/lib',
  $src: './src'
}
```