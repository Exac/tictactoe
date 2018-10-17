import { Injectable } from '@angular/core';
import Utils from './shared/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, first } from 'rxjs/operators';
import * as ws from 'ws';
import GameStateI from './shared/gamestate.interface';
import GameState from './shared/gamestate';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  public state: BehaviorSubject<GameState> = new BehaviorSubject<GameState>(new GameState());
  private socket: WebSocket = new WebSocket('ws://localhost:3000/');
  private messageQueue: any[] = [];


  constructor(public _gameService: GameService, public jwtService: JwtHelperService) {
    this.resetState();

    this.socket.onerror = (error) => {
      console.log('ERROR', error);
    }

    this.socket.onopen = (x: any) => {
      console.log('onopen()')
      let jwt = localStorage.getItem('access_token');

      let message: { type: string, auth: string, data: any[] } = {
        type: 'syn',
        auth: jwt,
        data: []
      };
      this.queue(message);
    }

    this.socket.onmessage = (message: MessageEvent) => {

      let data: any = Utils.parseJSON(message.data);
      console.log('MESSAGE', data)

      if (data.type === 'match') {
        this.handleMatch({ type: data.type, data: data.data });
      }
      if (data.type === 'update') {
        console.log('GAME STATE UPDATE')
      }
      if (data.type === 'gameover') {
        console.log('GAME OVER')
      }
      if (data.type === 'reauth') {
        this.handleReAuth();
      }

    }

  }

  private handleMatch = (message: { type: string, data: any[] }) => {
    // Setup state
    let _state = new GameState();
    _state.gameId = message.data[0];
    _state.opponentAlias = message.data[1];
    _state.opponentElo = message.data[2];
    _state.opponentType = message.data[3];
    _state.isInQueue = false;
    this.state.next(_state);
    // If we move first, wait for move, else, disable ability to place X or O
    console.log('handleMatch()', this.state.getValue());
  }

  private handleReAuth = () => {
    let jwt = localStorage.getItem('access_token');
    let message: { type: string, auth: string, data: any[] } = {
      type: 'syn',
      auth: jwt,
      data: []
    };
    this.queue(message);
  }

  private send(data: any) {
    this.queue(data);
  }

  public sendQueue(against: string) {
    let message: any = {};
    message.type = 'queue';
    message.auth = localStorage.getItem('access_token');
    message.data = [against];
    
    this.send(message);
    // tell our game state we've entered queue
    let _state = this.state.getValue();
    _state.isInQueue = true;
    this.setState(_state);

    console.log('queue', message)
  }


  public sendMatch(gameId: number, board: string[][], opponentStatus: string, playerStatus: string) {
    let message: any = {};
    message.type = 'update';
    message.auth = localStorage.getItem('access_token');
    message.data = [];
    message.data[0] = gameId;
    message.data[1] = board;
    message.data[2] = opponentStatus;
    message.data[3] = playerStatus;
    this.queue(message);
  }

  public sendGameOver(gameId: number, board: string[][], isPlayerWin: boolean, playerEloChange: number, playerElo: number, opponentEloChange: number, opponentElo: number) {
    let message: any = {};
    message.type = 'gameover';
    message.auth = localStorage.getItem('access_token');
    message.data = [];
    message.data[0] = gameId;
    message.data[1] = board;
    message.data[2] = isPlayerWin;
    message.data[3] = playerEloChange;
    message.data[4] = playerElo;
    message.data[5] = opponentEloChange;
    message.data[6] = opponentElo;
    this.queue(message);
  }

  public setState = (state: GameState) => {
    console.log('state change detected');
    this.state.next(state);
  }

  public getState = (): Observable<GameState> => {
    return this.state.asObservable();
  }

  public setBoard = (board: string[][]) => {
    console.log(`sb1`)
    let _state = this.state.getValue();
    // ensure it is the player's turn
    if(_state.isPlayerTurn) {
      console.log(`sb2`)
      _state.board = board;
      // this.state.next(_state);
      this.setState(_state);
    }
  }

  /**
   * Player makes a move.
   */
  public move = (x: number, y: number): boolean => {
    if(this.state.value.isPlayerTurn && this.state.value.board[x][y].length===0)  {
      this.state.value.board[x][y] = this.state.value.isPlayerTurn ? this.state.value.playerType : this.state.value.opponentType;
      return true;
    } else {
      return false;
    }
  }

  /**
   * Reset state
   */
  private resetState = () => {
    this.state.next(new GameState());
  }

  public getWinner = (_board?: string[][]): 'x' | 'o' | false => {
    // bad code
    // check all win conditions
    let b = typeof _board !== 'undefined' ? _board : this.state.getValue().board;
    if ((b[0][0] === 'x' && b[0][1] === 'x' && b[0][2] === 'x') ||
      (b[1][0] === 'x' && b[1][1] === 'x' && b[1][2] === 'x') ||
      (b[2][0] === 'x' && b[2][1] === 'x' && b[2][2] === 'x') ||
      (b[0][0] === 'x' && b[1][0] === 'x' && b[2][0] === 'x') ||
      (b[0][1] === 'x' && b[1][1] === 'x' && b[2][1] === 'x') ||
      (b[0][2] === 'x' && b[1][2] === 'x' && b[2][2] === 'x') ||
      (b[0][0] === 'x' && b[1][1] === 'x' && b[2][2] === 'x') ||
      (b[2][0] === 'x' && b[1][1] === 'x' && b[0][2] === 'x')) { return 'x'; }
      if ((b[0][0] === 'o' && b[0][1] === 'o' && b[0][2] === 'o') ||
      (b[1][0] === 'o' && b[1][1] === 'o' && b[1][2] === 'o') ||
      (b[2][0] === 'o' && b[2][1] === 'o' && b[2][2] === 'o') ||
      (b[0][0] === 'o' && b[1][0] === 'o' && b[2][0] === 'o') ||
      (b[0][1] === 'o' && b[1][1] === 'o' && b[2][1] === 'o') ||
      (b[0][2] === 'o' && b[1][2] === 'o' && b[2][2] === 'o') ||
      (b[0][0] === 'o' && b[1][1] === 'o' && b[2][2] === 'o') ||
      (b[2][0] === 'o' && b[1][1] === 'o' && b[0][2] === 'o')) { return 'o'; }
      return false;
  }

  /**
   * Sends messages to the server. If we haven't connected yet, stores 
   * messages to send when the socket connects to the server.
   */
  private queue = (data?: any) => {
    const size = this.messageQueue.length;

    if (data) {
      this.messageQueue.push(data);
    }

    if (this.socket.readyState) {
      this.messageQueue.map((x) => {
        if (typeof x !== 'string') {
          x = JSON.stringify(x);
        }
        this.socket.send(x)
      })
      this.messageQueue = [];
      return;
    }

    if (size === 0 || !data) {
      setTimeout(() => { this.queue() }, 10);
    }

  }

}
