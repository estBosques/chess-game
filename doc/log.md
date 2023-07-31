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

# Development

The entries in this section will be divided by component or concept (i.e., troubleshooting, issue, improvements). I believe this way will be more useful than using a dated/chronological type log.

## Components

### Board 

This is the first thing I decided to implement.

- After creating the `Square` component (see [Square](#square)), I created multiple `Square` elements using the `{#each} ... {/each}`
syntax.
  - I used the `Array(n).fill(x)` function to create an empty 2d-list.
    - #v2: I changed the way I initialized the matrix, by manually creating the array (`[['a','b',...],...,[]]`) and setting the pieces in their place. For implementation on the pieces see [Pieces](#pieces)
- I also added the letter rows and number columns around the board. I did this by manually creating additional rows or squares where needed.
  - I know I could have used a different approach (e.g., `::after` and `::before` pseudo-elements), but I'm not very familiar with those elements, so I decided to use elements instead of pseudo-elements for now. I'll probably change this in the future.
#### Square 

- So, in order to create a board I have to create the squares that make it.
- I started by creating a `Square` component that will represent a square.
  - `Square` only has a `div` element at this point (plus styling).
  - I used classes to select which color the `Square` will be.
- For development, I added a change color function when I click on a square.

### Pieces

- I used fontawesome icon library to get the icons -- I followed the instructions on their website to do it.
- Regarding the implementation, I used a 2-char notation: [color][type]:
  - color: The piece color, `'b'` for black and `'w'` for white.
  - type: The piece type:
    - `'p'`: Pawn
    - `'r'`: Rook
    - `'n'`: Knight
    - `'b'`: Bishop
    - `'q'`: Queen
    - `'k'`: King