import { Component, OnInit } from '@angular/core';
import { SellerService } from '../../services/seller.service';

@Component({
    selector: 'app-manage-shop',
    templateUrl: './manage-shop.component.html',
    styleUrls: ['./manage-shop.component.css']
})
export class ManageShopComponent implements OnInit {

    private isAllProducts: boolean;
    private isAvailableProducts: boolean;
    private isOutOfStockProducts: boolean;
    private isAddProduct: boolean;
    private isShopHistory: boolean;
    private isEditShop: boolean;
    private isLoad: boolean;


    private seller;
    private products;

    dtOptions: DataTables.Settings = {};

    constructor(
        private sellerService: SellerService,
    ) { }

    ngOnInit() {
        this.isAllProducts = true;
        this.isAvailableProducts = false;
        this.isOutOfStockProducts = false;
        this.isAddProduct = false;
        this.isShopHistory = false;
        this.isEditShop = false;
        this.isLoad = false;

        this.dtOptions = {
            pagingType: 'full_numbers'
        };
        this.onSetUpPage();


    }


    onSetUpPage() {

        this.seller = JSON.parse(localStorage.getItem("seller"));
        console.log("onSetUpPage this. seller: ", this.seller);
        this.sellerService.getAllProducts(this.seller).subscribe(
            data => {
                this.products = data.data;
                this.isLoad = true;

            },
            error => console.log(error)
        );
    }


    toogle() {
        var x = document.getElementById("myTopfilter");
        if (x.className === "topnav") {
            x.className += " responsive";
        } else {
            x.className = "topnav";
        }
    }

    onSelectAllProducts() {
        this.isAllProducts = true;
        this.isAvailableProducts = false;
        this.isOutOfStockProducts = false;
        this.isAddProduct = false;
        this.isShopHistory = false;
        this.isEditShop = false;
    }

    onSelectAvailableProducts() {
        this.isAllProducts = false;
        this.isAvailableProducts = true;
        this.isOutOfStockProducts = false;
        this.isAddProduct = false;
        this.isShopHistory = false;
        this.isEditShop = false;
    }

    onSelectOutOfStockProduct() {
        this.isAllProducts = false;
        this.isAvailableProducts = false;
        this.isOutOfStockProducts = true;
        this.isAddProduct = false;
        this.isShopHistory = false;
        this.isEditShop = false;
    }

    onSelectAddProduct() {
        console.log("createNewProduct")
        // window.location.href = "/manage-shop/create-product";
        this.isAllProducts = false;
        this.isAvailableProducts = false;
        this.isOutOfStockProducts = false;
        this.isAddProduct = true;
        this.isShopHistory = false;
        this.isEditShop = false;

    }

    onSelectShopHistory() {
        this.isAllProducts = false;
        this.isAvailableProducts = false;
        this.isOutOfStockProducts = false;
        this.isAddProduct = false;
        this.isShopHistory = true;
        this.isEditShop = false;

    }

    onSelectEditShop() {
        this.isAllProducts = false;
        this.isAvailableProducts = false;
        this.isOutOfStockProducts = false;
        this.isAddProduct = false;
        this.isShopHistory = false;
        this.isEditShop = true;

    }
}
