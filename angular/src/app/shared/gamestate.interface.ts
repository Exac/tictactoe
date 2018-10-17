export default interface GameStateI {
    board: string[][];
    gameId: number;
    opponentAlias: string;
    opponentElo: number;
    opponentType: 'x' | 'o';
    playerType: 'x' | 'o';
}
