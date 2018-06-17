import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-table-data',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.css']
})
export class TableDataComponent implements OnInit {

  @Input() products: Object;

  constructor() { }

  ngOnInit() {
    console.log("ngOnInit table-data: ",this.products);
  }

}
