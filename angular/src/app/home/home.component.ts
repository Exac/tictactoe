import { Component, OnInit } from '@angular/core';
import * as ws from 'ws';
import Utils from '../shared/utils'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // private socket: WebSocket = new WebSocket('ws://localhost:3000/')
  private messages: any[] = [];


  constructor() {

  }

  ngOnInit() {

  }

}
