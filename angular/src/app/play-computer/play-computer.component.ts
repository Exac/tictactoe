import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from '../game.service';
import { Subscription } from 'rxjs';
import GameStateI from '../shared/gamestate.interface';
import GameState from '../shared/gamestate';

@Component({
  selector: 'app-play-computer',
  templateUrl: './play-computer.component.html',
  styleUrls: ['./play-computer.component.scss']
})
export class PlayComputerComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription;
  protected playerMove: HTMLAudioElement;
  private state: GameState;

  constructor(private game: GameService) {
    this.playerMove = new Audio('./assets/player-move.mp3');
  }

  ngOnInit() {
    // bind this.state to GameService
    this.subscriptions = new Subscription();
    this.subscriptions.add(
      this.game.state.subscribe((_state: GameState) => {
        console.log('game.state changed:', _state);
        this.state = _state;
      })
    )

    // this.queue();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private clearBoard = () => {
    this.game.setState(new GameState());
  }

  private queue = (event: MouseEvent, type: string) => {
    // On page load, we want to immediatley start a game against a computer
    if (type === 'ai') this.game.sendQueue('ai');
    if (type === 'pvp') this.game.sendQueue('pvp');
  }

  private place = (event: MouseEvent) => {
    const target: HTMLElement = (<HTMLElement>event.target);
    // Get square name from id ('a1', 'b2', 'c3')
    const square: string = target.id;
    // Game is over when all squares have been filled
    if (this.state.board.reduce((acc, val) => acc.concat(val), []).indexOf('') < 0) {
      this.clearBoard();
      return;
    }
    // find coordinates
    let x: number;
    let y: number;
    if (square.charAt(0) === 'a') y = 0;
    if (square.charAt(0) === 'b') y = 1;
    if (square.charAt(0) === 'c') y = 2;
    if (square.charAt(1) === '1') x = 2;
    if (square.charAt(1) === '2') x = 1;
    if (square.charAt(1) === '3') x = 0;
    // Only move if it is the player's turn
    if (this.state.board[x][y].length === 0 && this.state.isPlayerTurn) {
      this.playerMove.play();
      this.game.move(x, y);
    } else if (!this.state.isPlayerTurn) {
      console.error(`Wait for your opponent to move!`)
    } else {
      console.error(`${square} already has a ${this.state.board[x][y]}!`)

    }
  }

  private forefit = (event: MouseEvent) => {
    this.clearBoard();
  }

  get gameOverMessage(): string {
    let state: GameState = this.game.state.getValue();
    let playerType: 'x' | 'o' = state.playerType;
    let winner: 'x' | 'o' | false = state.winner;
    if (state.winner === false) return `Tie. Better luck next time.`;
    if (winner === playerType) {
      return `You win!`;
    } else {
      return `You lose.`;
    }
  }

}
