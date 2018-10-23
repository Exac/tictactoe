import chalk from 'chalk';

export default class AI {
    constructor() {

    }

    public static getMove(_board: string[][], type: 'x' | 'o'): string[][] {
        let board = JSON.parse(JSON.stringify(_board));
        let turn = AI.getTurnFromBoard(board);
        // Turn 1
        if (turn === 1) {
            // Check for empty board
            if (AI.smoosh(board, 1).every(e => e === '')) {
                // choose a random corner
                let x: number = Math.floor(Math.random() * 2) === 0 ? 2 : 0;
                let y: number = Math.floor(Math.random() * 2) === 0 ? 2 : 0;
                board[x][y] = 'x';
                return board;
            } else {
                return board;
            }
        } else if (turn === 2) {
            if (board[1][1] === '') {
                console.log(chalk.white.bgBlue(`[TTT.ai]`) + ` t2: take center`);
                board[1][1] = type; // Take center square if avaliable
                return board;
            } else {
                // take a corner
                switch (Math.floor(Math.random() * 4)) {
                    case 0:
                        board[0][0] = type;
                        break;
                    case 1:
                        board[2][0] = type;
                        break;
                    case 2:
                        board[2][2] = type;
                        break;
                    case 3:
                        board[0][2] = type;
                        break;
                }
                return board;
            }
        } else if (turn === 3) {
            // if opponent took middle
            if (board[1][1] === (type === 'x' ? 'o' : 'x')) {
                // pick the opposite corner if possible
                if (board[0][0] === type) { board[2][2] = type; return board; }
                if (board[0][2] === type) { board[2][0] = type; return board; }
                if (board[2][2] === type) { board[0][0] = type; return board; }
                if (board[2][0] === type) { board[0][2] = type; return board; }
                board[0][2] = type;
                return board;
            } else {
                return AI.placeDouble(board, type);
            }
        } else {
            console.log(JSON.stringify(AI.placeAntiTriple(board, type)))
            console.log(JSON.stringify(_board))
            console.log(chalk.white.bgBlue(`[TTT.ai]`) + ` equal:`, (JSON.stringify(AI.placeAntiTriple(board, type)) !== JSON.stringify(_board)));
            if (JSON.stringify(AI.placeAntiTriple(board, type)) !== JSON.stringify(_board)) {
                console.log(chalk.white.bgBlue(`[TTT.ai]`) + ' ANTI-TRIPLE VS BOARD')
                return AI.placeAntiTriple(board, type);
            } else {
                console.log(chalk.white.bgBlue(`[TTT.ai]`) + ' DOUBLE VS BOARD')
                return AI.placeDouble(board, type);
            }
        }

    }

    /**
     * Can the AI take square x,y, or does the opponent already have it?
     * @param board board
     * @param x x coord AI wants to move to
     * @param y y coord AI wants to move to
     */
    public static try(board: string[][], x: number, y: number): boolean {
        return board[x][y] === '';
    }

    public static placeAntiTriple(_board: string[][], type: 'x' | 'o'): string[][] {
        let board: string[][] = JSON.parse(JSON.stringify(_board));
        // imgur.com/aZP97ZZ.jpg

        let ot: string = type === 'x' ? 'o' : 'x'; // Opponent's type
        let x: number = -1;
        let y: number = -1;
        // Check all 8 combinations
        // H1
        if (board[0][0] === ot && board[0][1] === ot && board[0][2] === '') { if (AI.try(board, 0, 2)) { x = 0; y = 2; } } // xxx
        if (board[0][0] === ot && board[0][1] === '' && board[0][2] === ot) { if (AI.try(board, 0, 1)) { x = 0; y = 1; } } // 
        if (board[0][0] === '' && board[0][1] === ot && board[0][2] === ot) { if (AI.try(board, 0, 0)) { x = 0; y = 0; } } // 
        // H2
        if (board[1][0] === ot && board[1][1] === ot && board[1][2] === '') { if (AI.try(board, 1, 2)) { x = 1; y = 2; } } // 
        if (board[1][0] === ot && board[1][1] === '' && board[1][2] === ot) { if (AI.try(board, 1, 1)) { x = 1; y = 1; } } // xxx
        if (board[1][0] === '' && board[1][1] === ot && board[1][2] === ot) { if (AI.try(board, 1, 0)) { x = 1; y = 0; } } // 
        // H3
        if (board[2][0] === ot && board[2][1] === ot && board[2][2] === '') { if (AI.try(board, 2, 2)) { x = 2; y = 2; } } // 
        if (board[2][0] === ot && board[2][1] === '' && board[2][2] === ot) { if (AI.try(board, 2, 1)) { x = 2; y = 1; } } // 
        if (board[2][0] === '' && board[2][1] === ot && board[2][2] === ot) { if (AI.try(board, 2, 0)) { x = 2; y = 0; } } // xxx
        // V1
        if (board[0][0] === ot && board[1][0] === ot && board[2][0] === '') { if (AI.try(board, 0, 0)) { x = 0; y = 0; } } // x
        if (board[0][0] === ot && board[1][0] === '' && board[2][0] === ot) { if (AI.try(board, 1, 0)) { x = 1; y = 0; } } // x
        if (board[0][0] === '' && board[1][0] === ot && board[2][0] === ot) { if (AI.try(board, 2, 0)) { x = 2; y = 0; } } // x
        // V2
        if (board[0][1] === ot && board[1][1] === ot && board[2][1] === '') { if (AI.try(board, 0, 1)) { x = 0; y = 1; } } //  x
        if (board[0][1] === ot && board[1][1] === '' && board[2][1] === ot) { if (AI.try(board, 1, 1)) { x = 1; y = 1; } } //  x
        if (board[0][1] === '' && board[1][1] === ot && board[2][1] === ot) { if (AI.try(board, 2, 1)) { x = 2; y = 1; } } //  x
        // V3
        if (board[0][2] === ot && board[1][2] === ot && board[2][2] === '') { if (AI.try(board, 0, 2)) { x = 0; y = 2; } } //   x
        if (board[0][2] === ot && board[1][2] === '' && board[2][2] === ot) { if (AI.try(board, 1, 2)) { x = 1; y = 2; } } //   x
        if (board[0][2] === '' && board[1][2] === ot && board[2][2] === ot) { if (AI.try(board, 2, 2)) { x = 2; y = 2; } } //   x
        // DU
        if (board[2][0] === ot && board[1][1] === ot && board[0][2] === '') { if (AI.try(board, 2, 0)) { x = 2; y = 0; } } //   x
        if (board[2][0] === ot && board[1][1] === '' && board[0][2] === ot) { if (AI.try(board, 1, 1)) { x = 1; y = 1; } } //  x 
        if (board[2][0] === '' && board[1][1] === ot && board[0][2] === ot) { if (AI.try(board, 0, 2)) { x = 0; y = 2; } } // x
        // DD
        if (board[0][0] === ot && board[1][1] === ot && board[2][2] === '') { if (AI.try(board, 2, 2)) { x = 2; y = 2; } } // x
        if (board[0][0] === ot && board[1][1] === '' && board[2][2] === ot) { if (AI.try(board, 1, 1)) { x = 1; y = 1; } } //  x
        if (board[0][0] === '' && board[1][1] === ot && board[2][2] === ot) { if (AI.try(board, 0, 0)) { x = 0; y = 0; } } //   x

        if (x === -1 || y === -1) {
            // nothing changed, return the original board
            return board;
        }

        board[x][y] = type;
        return board;
    }

    /**
     * Makes a random double move.
     */
    public static placeDouble = (_board: string[][], type: 'x' | 'o'): string[][] => {
        let board = JSON.parse(JSON.stringify(_board))
        if (AI.getSquares(board, '').length === 0) {
            return board; // game is already over
        }
        // Squares I've already moved on
        let mySquares: number[][] = AI.getSquares(board, type);
        let possibilities: any[] = [];
        for (let i = 0; i < mySquares.length; i++) {
            AI.getNeighbours(board, mySquares[i][0], mySquares[i][1], '').forEach((coords) => {
                possibilities.push(coords);
            })
        }
        // Remove duplicates
        let moves = AI.uniqueCoords(possibilities);
        if (moves.length === 0) {
            console.warn('Game was already won')
            return board;
        }
        // Choose a random square to move to
        let rand = Math.floor(Math.random() * moves.length)
        board[moves[rand][0]][moves[rand][1]] = type;
        return board;
    }

    /**
     * Finds the coordinates of the squares that match the type provided
     * @param board The board
     * @param type Type of square to search for
     * @example AI.getSquares([['x','',''],['','',''],['','','']], 'x') // [[0,0]]
     */
    public static getSquares = (board: string[][], type: 'x' | 'o' | ''): number[][] => {
        let matches: number[][] = [];
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                if (board[x][y] === type) {
                    matches.push([x, y]);
                }
            }
        }
        return matches;
    }

    /**
     * Find neighbours of a certain type, for a cell x,y on board.
     * @param x x coord of cell
     * @param y y coord of cell
     * @param type type of neighbours to search for
     * @example AI.getNeighbours([['x','o','x'],['','',''],['','','']], 1, 1, 'x' ) // [[0,0], [2,0]]
     */
    public static getNeighbours = (board: string[][], x: number, y: number, type: 'x' | 'o' | ''): number[][] => {
        let empties: number[][] = [];
        // loop through every possible coord -1 +1 around the target x,y coord
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                // origin cell does not count as a neighbour
                if (!(i == 0 && j == 0)) {
                    if (AI.existsRelation(x, y, i, j) && board[x + i][y + j] === type) {
                        empties.push(new Array(x + i, y + j));
                    }
                }
            }
        }
        return empties;
    }

    /**
     * Is there a square relative to x,y?
     * @param x original square x coord
     * @param y original square y coord
     * @param rx relative square x coord
     * @param ry relative square y coord
     * @example AI.existsRelation(0, 0, 1, 0) // => true (1,0)
     * AI.existsRelation(0, 0, -1, 0) // => false (-1,0) (outside board)
     */
    public static existsRelation(x: number, y: number, rx: number, ry: number) {
        return AI.existsSquare(x + rx, y + ry);
    }

    /**
     * Is the x,y coord a square on the board?
     * @param x x coord
     * @param y y coord
     */
    public static existsSquare(x: number, y: number): boolean {
        return (x >= 0 && x <= 2 && y >= 0 && y <= 2);
    }

    /**
     * Limit number to size of the board.
     * @param num limited to 0/1/2
     * @deprecated
     */
    public static lim(num: number): number {
        return Math.min(Math.max(num, 0), 2);
    }

    public static uniqueCoords(array: any[]): any[] {
        var unique = array.map(cur => JSON.stringify(cur))
            .filter(function (curr, index, self) {
                return self.indexOf(curr) == index;
            })
            .map(cur => JSON.parse(cur));
        return unique;
    }

    /**
     * Flatten array
     * @example AI.smoosh(['a',['b', 'c']]) // ['a', 'b', 'c']
     */
    public static smoosh = (array: any[], depth = 1): string[] => {
        return array.reduce(function (flat, toFlatten) {
            return flat.concat((Array.isArray(toFlatten) && (depth - 1))
                ? AI.smoosh(toFlatten, -1)
                : toFlatten);
        }, []);
    }

    /**
     * Determine which player moves next. Player 'x' always moves first.
     */
    public static getTurnFromBoard = (board: string[][]): number => {
        const smoosh: string[] = AI.smoosh(board);
        let turn = 0;
        smoosh.forEach((square) => { turn = square === 'x' || square === 'o' ? turn + 1 : turn });
        ++turn;
        return turn
    }

    /**
     * does 'x' or 'o' move next?
     */
    public static getNextPlayerTypeFromBoard = (board: string[][]): 'x' | 'o' => {
        let turn = AI.getTurnFromBoard(board);
        return turn % 2 === 0 ? 'o' : 'x';
    }

    /**
     * Is there a winning combo on the board?
     * @param _board 
     */
    public static getWinner(_board: string[][]): 'x' | 'o' | false {
        // make a copy of the board
        let b = JSON.parse(JSON.stringify(_board));

        /**
         * Are all three tictactoe squares x's or o's?
         */
        function areLine(a: string, b: string, c: string): boolean {
            // Blanks don't count
            if (a === '') return false;
            return (a === b && a === c);
        }

        if (areLine(b[0][0], b[0][1], b[0][2])) return b[0][0];
        if (areLine(b[1][0], b[1][1], b[1][2])) return b[1][0];
        if (areLine(b[2][0], b[2][1], b[2][2])) return b[2][0];
        if (areLine(b[0][0], b[1][0], b[2][0])) return b[0][0];
        if (areLine(b[0][1], b[1][1], b[2][1])) return b[0][1];
        if (areLine(b[0][2], b[1][2], b[2][2])) return b[0][2];
        if (areLine(b[0][0], b[1][1], b[2][2])) return b[0][0];
        if (areLine(b[2][0], b[1][1], b[0][2])) return b[2][0];

        return false;
    }

    public static isWinner(board: string[][]): boolean {
        return AI.getWinner(board) !== false;
    }
}