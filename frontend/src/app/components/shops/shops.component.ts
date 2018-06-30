import { Component, OnInit } from '@angular/core';
import { BuyerService } from '../../services/buyer.service';
import { SellerService } from '../../services/seller.service';

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
  private shops;

  private form = {
    product_name: null,
    product_description: null,
    product_price:null
  }


  constructor(
    private BuyerService: BuyerService,
    private SellerService: SellerService,

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
        this.getAllShops();
      },
      error => console.log(error)
    )


  }


  getAllShops() {
    this.SellerService.getAllShops().subscribe(
      response => {
        console.log("getAllShops: ", response.data);
        this.shops = response.data;
      },
      error => console.log(error)
    )
  }

  openInfo(product){
    console.log("onClick product: ",product)
    this.form.product_name= product.product_name,
    this.form.product_description= product.product_description,
    this.form.product_price=product.product_price
  }

  addToCart(product) {
    console.log("addToCart: ",product)
    // localStorage.setItem("cart",product);
  }

}
