import { Component, OnInit } from '@angular/core';
import { BuyerService } from '../../services/buyer.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.css']
})
export class ShopsComponent implements OnInit {

  private products;
  private isLoad: boolean = true;
  private product_catagory;


  constructor(
    private BuyerService: BuyerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.isLoad = !this.isLoad;
    this.getAllProducts();

  }

  getAllProducts() {
    this.BuyerService.getAllProducts().subscribe(
      response => {
        console.log("getAllProducts: ", response.data);
        this.products = response.data;
        this.getProductCatagory();
      },
      error => console.log(error)
    )

  }

  getProductCatagory() {
    this.BuyerService.getProductCategories().subscribe(
      response => {
        console.log("getProductCatagory: ", response.data);
        this.product_catagory = response.data;
        // this.isLoad = !this.isLoad;
      },
      error => console.log(error)
    )


  }

}
