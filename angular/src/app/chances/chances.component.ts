import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chances',
  templateUrl: './chances.component.html',
  styleUrls: ['./chances.component.scss']
})
export class ChancesComponent implements OnInit {

  @Input() percent: number;

  constructor() { }

  ngOnInit() {
  }

}
