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

  private turnNum: number = 1; // temporary
  private subscriptions: Subscription;
  protected playerMove: HTMLAudioElement;
  protected sounds: any = {};
  private state: GameState;

  constructor(private game: GameService) {
    this.sounds.move = new Audio('/assets/player-move.mp3');
  }

  ngOnInit() {
    // bind this.state to GameService
    this.subscriptions = new Subscription();
    this.subscriptions.add(
      this.game.state.subscribe((_state: GameState) => {
        console.log('game.state updated:', _state);
        this.state = _state;
      })
    )

    // this.queue();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private clearBoard = () => {
    this.turnNum = 1;
    this.game.setState(new GameState());
  }

  private queue = (event: MouseEvent, type: string) => {
    // On page load, we want to immediatley start a game against a computer
    if (type === 'ai') this.game.sendQueue('ai');
    if (type === 'pvp') this.game.sendQueue('pvp');
    // this.clearBoard();
  }

  private place = (event: MouseEvent) => {
    const target: HTMLElement = (<HTMLElement>event.target);
    // Get square name from id ('a1', 'b2', 'c3')
    const square: string = target.id;
    // Game is over after all squares are filled
    if (this.turnNum > 9) {
      this.clearBoard();
      return;
    }
    // if (this.state.board.flat().findIndex(i => i === '') === -1) {
    //   // no more blank squares
    // }
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
      this.turnNum++;
      this.sounds.move.play();
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

}
