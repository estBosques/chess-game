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
- Because I wanted to create a way to show the possible moves of a piece, I created an event catcher (see [Square](#square) for the event implementation). For this to work I'm not passing an array to the `Square` component with its position in the board. That way I'll now be able to know which piece I selected.
  - I created a file with the piece movement calculation called `/utils/piece-movement.ts`. This file will handle all calculations for the selected piece
  - Once I calculate the possible moves, I pass a `highlight` flag to each `Square` in the resulting array to highlight the possible movements.
#### Square 

- So, in order to create a board I have to create the squares that make it.
- I started by creating a `Square` component that will represent a square.
  - `Square` only has a `div` element at this point (plus styling).
  - I used classes to select which color the `Square` will be.
- For development, I added a change color function when I click on a square.
- To select the piece and figure out how where the piece can move I added an event forwarding method when I click the piece. This will send the coordinates of the square back to the board (which will be the one responsible to figure out the possible moves)

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
- Pieces movement was pretty simple, basically it was all about checking if the target cell was empty or had an opponent piece.
  - In general, I used a relative positioning strategy, by using -1, 0, and 1 (also, -2 and 2 in some cases) to calculate the movement. This way I'd just add or substract from the current position.
  - The Queen, Rook and Bishop have similar movment style, it was all about changing the direction
  - The Pawn was also simple as it only moves forward 1 space; except on the first move or capturing, which was easy to implement by looking at the board. The tricky part was to implement the [*en passant*](https://en.wikipedia.org/wiki/En_passant) rule, but I added an additional character in the pawn's board representation. `*` means that the pawn hasn't moved yet, while `^` means that the pawn was moved in the previous turn. By looking at this I could identify if the *en passant* rule can be applied.
  - The horse was simple, just hardcoded the movements.
  - The most complicated movement was the King. Since it can't move to a position near another King, so what I did was look in a 2 cell radius and check if there was another King. If there was then I calculate which spaces match with both Kings attack range. 
    - I noticed that by calculating the half point of the relative distance to the other King, I could find which square the other King could move (check `piece-movement.ts#findKingMoves()` for the actual code). 
    - The exception to this method is when the other King is the same X/Y-axis position as the current King, because it will miss the diagonals. To fix this I  manually added these missing squares to the 'prohibited spaces'
    - At the moment of writing this entry I realized I forgot to check for possible movements of the opponent and prevent the King to move into positions that would threaten it.
      - I removed the the validation for near Kings and changed it for a more generic validation. This way I can check for any threatening piece, not just another King; thus preventing a movement that could result in *check*.