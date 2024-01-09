import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BoardSearch} from "../board-models/board-search.model";

@Component({
  selector: 'app-board-search',
  templateUrl: './board-search.component.html',
  styleUrls: ['./board-search.component.css']
})


export class BoardSearchComponent implements OnInit {
  @Input() search: string;
  @Output() searchData = new EventEmitter<BoardSearch>();

  constructor() { }

  ngOnInit(): void {
  }

  searchType(type: string) {
    if (this.search == '' || this.search == undefined) {
      return
    }
    const tempData: BoardSearch = {
      search: this.search,
      type: type,
    }
    this.searchData.emit(tempData);

  }

  searchDataInit() {
    this.search = '';
  }
}
