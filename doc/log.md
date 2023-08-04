The purpose of this log is to document setup steps and developer notes. The idea is to record set up steps required to get the project going, so it can be used in future projects. 

# Setup

## Bootstrap

According to their webside, there are different ways to configure bootstrap on a project. For this project I chose to use a Node module approach.
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

## Aliases

Just like I did with bootstrap, I'll create some alias in `svelte.config.js`. To do this, I updated the kit property by adding a `alias` entry:
```js
alias: {
  $lib: './src/lib',
  $src: './src'
}
```

# Development notes

## Piece movement

Pieces movement was pretty simple, basically it was all about checking if the target cell was empty or had an opponent piece.
  - In general, I used a relative positioning strategy, by using -1, 0, and 1 (also, -2 and 2 in some cases) to calculate the movement. This way I'd just add or substract from the current position.

### Queen, Rook and Bishop
The Queen, Rook and Bishop have similar movment style, it was all about changing the direction

### Pawn
The Pawn was also simple as it only moves forward 1 space; except on the first move or capturing, which was easy to implement by looking at the board. The tricky part was to implement the [*en passant*](https://en.wikipedia.org/wiki/En_passant) rule~~, but I added an additional character in the pawn's board representation. `*` means that the pawn hasn't moved yet, while `^` means that the pawn was moved in the previous turn.~~. I added 2 flags on the Piece implementation: `_enPassant` to indicate the piece was moved 2 spaces in the las turn (can only be true to pawns), and `_hasMoved` to indicate that the piece hasn't moved yet, this way we can allow the pawn piece to move 2 spaces. By looking at this I could identify if the *en passant* rule can be applied.

### Knight
  - The knight was simple, just hardcoded the movements.

### King
The most complicated movement was the King. Since it can't move to a position near another King, so what I did was look in a 2 cell radius and check if there was another King. If there was then I calculate which spaces match with both Kings attack range. 

~~I noticed that by calculating the half point of the relative distance to the other King, I could find which square the other King could move (check `piece-movement.ts#findKingMoves()` for the actual code).~~
~~The exception to this method is when the other King is the same X/Y-axis position as the current King, because it will miss the diagonals. To fix this I  manually added these missing squares to the 'prohibited spaces'~~
~~At the moment of writing this entry I realized I forgot to check for possible movements of the opponent and prevent the King to move into positions that would threaten it.~~
I created a more generic validation by going through every opponent piece and checking if their possible moves share a position in the kings possible move list -- this would mean that if the King moves there it would be threaten by another piece; thus preventing a movement that could result in *check*.
