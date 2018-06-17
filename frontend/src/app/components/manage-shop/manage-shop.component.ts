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
    private availableProducts=[];
    private outOfStockProducts=[];

    private catagory;

    dtOptions: DataTables.Settings = {};

    constructor(
        private sellerService: SellerService,
    ) { }

    ngOnInit() {
        this.onSetUpPage();
        this.getAllProducts();
        this.getShopCatagory();
        this.getProductCategories();
    }


    onSetUpPage() {
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

    }

    getAllProducts() {
        this.seller = JSON.parse(localStorage.getItem("seller"));
        this.sellerService.getAllProducts(this.seller).subscribe(
            response => {
                this.products = response.data;
                console.log("response from getAllProducts: ", response.data)
                this.setIsAvailableProduct();

            },
            error => console.log(error)
        )
    }

    getProductCategories() {
        this.sellerService.getProductCategories().subscribe(
            response => {
                console.log("response from catagory: ", response)
                this.catagory = response.data;
                localStorage.setItem("product_catagory", JSON.stringify(this.catagory));
                this.isLoad = true;

            },
            error => console.log("response from catagory: ", error)
        )

    }

    getShopCatagory() {
        this.sellerService.getShopCategories().subscribe(
            response => localStorage.setItem("shop_catagory", JSON.stringify(response.data)),
            error => console.log(error)
        )

    }

    setIsAvailableProduct() {
        this.products.forEach(element => {
            console.log("setIsAvailableProduct element: ",element)
            if(element.unit_in_stock == 0){
                this.outOfStockProducts.push(element);
            }
            else if(element.unit_in_stock > 0){
                this.availableProducts.push(element);

            }
        });
    }

    toogle() {
        var x = document.getElementById("myTopfilter");
        if (x.className === "topnav") {
            x.className += " responsive";
        } else {
            x.className = "topnav";
        }
    }

    isSelected() {
        return false
    }

    onSelectAllProducts() {
        this.isAllProducts = true;
        this.isAvailableProducts = false;
        this.isOutOfStockProducts = false;
        this.isAddProduct = false;
        this.isShopHistory = false;
        this.isEditShop = false;
        this.ngOnInit();
    }

    onSelectAvailableProducts() {
        this.isAllProducts = false;
        this.isAvailableProducts = true;
        this.isOutOfStockProducts = false;
        this.isAddProduct = false;
        this.isShopHistory = false;
        this.isEditShop = false;
        // this.ngOnInit();

    }

    onSelectOutOfStockProduct() {
        this.isAllProducts = false;
        this.isAvailableProducts = false;
        this.isOutOfStockProducts = true;
        this.isAddProduct = false;
        this.isShopHistory = false;
        this.isEditShop = false;
        // this.ngOnInit();

    }

    onSelectAddProduct() {
        console.log("createNewProduct")
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
