import { Component, OnInit } from '@angular/core';
import { SellerService } from '../../services/seller.service';

@Component({
    selector: 'app-manage-shop',
    templateUrl: './manage-shop.component.html',
    styleUrls: ['./manage-shop.component.css']
})
export class ManageShopComponent implements OnInit {

    private isAllProducts: boolean = true;
    private isAvailableProducts: boolean = false;
    private isOutOfStockProducts: boolean = false;
    private isAddProduct: boolean = false;
    private isShopHistory: boolean = false;
    private isEditShop: boolean = false;
    private isNorti:boolean = false;
    private isLoad: boolean = false;

    private seller;
    private products;
    private history;
    private type;
    
    private availableProducts=[];
    private outOfStockProducts=[];
    private masterData;

    private catagory;
    private headers_history = [{
        order_id:'Order id',
        order_status: {
        order_status_id:'Order status id',
        order_status_name:'Order status'
        },
        updated_at: 'Updated at'
    }]
    dtOptions: DataTables.Settings = {};

    constructor(
        private sellerService: SellerService,
    ) { }

    ngOnInit() {
        this.onSetUpPage();
        this.getAllProducts();
    }


    onSetUpPage() {
        this.dtOptions = {
            pagingType: 'full_numbers'
        };

    }

    getAllHistory() {
        this.seller = JSON.parse(localStorage.getItem("seller_id"));
        this.sellerService.getOrderHistory(this.seller).subscribe(
            response => {      
                this.history = response.data       
                console.log("[response] ",this.products)
                this.isLoad = !this.isLoad;

            },
            error => console.log(error)
        )
    }

    getAllProducts() {
        this.seller = JSON.parse(localStorage.getItem("seller_id"));
        this.sellerService.getAllProducts(this.seller).subscribe(
            response => {
                this.products = response.data;
                // console.log("response from getAllProducts: ", response.data)
                this.getProductCategories();
                
                


            },
            error => console.log(error)
        )
    }

    getProductCategories() {

        this.masterData = JSON.parse(localStorage.getItem('masterData'))
        this.catagory = this.masterData.product_category;
        console.log("this.catagory: ", this.catagory)
        this.getAllHistory();

        // this.setIsAvailableProduct();
        



    }

    getShopCatagory() {
        this.sellerService.getShopCategories().subscribe(
            response => {
               localStorage.setItem("shop_catagory", JSON.stringify(response.data));

            },
            error => console.log(error)
        )

    }

    setIsAvailableProduct() {
        this.products.forEach((element,index) => {
            // console.log("setIsAvailableProduct element: ",element)
            if(element.unit_in_stock == 0){
                this.outOfStockProducts.push(element);
            }
            else if(element.unit_in_stock > 0){
                this.availableProducts.push(element);

            }
        })
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
        this.isNorti = false;  
        this.ngOnInit();
    }

    onSelectAvailableProducts() {
        this.isAllProducts = false;
        this.isOutOfStockProducts = false;
        this.isAddProduct = false;
        this.isShopHistory = false;
        this.isEditShop = false;
        this.isNorti = false;  
        this.isAvailableProducts = true;


    }

    onSelectOutOfStockProduct() {
        this.isAllProducts = false;
        this.isAvailableProducts = false;
        this.isAddProduct = false;
        this.isShopHistory = false;
        this.isEditShop = false;
        this.isNorti = false;  
        this.isOutOfStockProducts = true;


    }

    onSelectAddProduct() {
        console.log("createNewProduct")
        this.isAllProducts = false;
        this.isAvailableProducts = false;
        this.isOutOfStockProducts = false;
        this.isShopHistory = false;
        this.isEditShop = false;
        this.isNorti = false;  
        this.isAddProduct = true;

    }

    onSelectShopHistory() {
        this.isAllProducts = false;
        this.isAvailableProducts = false;
        this.isOutOfStockProducts = false;
        this.isAddProduct = false;
        this.isEditShop = false;
        this.isNorti = false;  
        this.isShopHistory = true;
        this.type = 'history'

    }

    onSelectEditShop() {
        this.isAllProducts = false;
        this.isAvailableProducts = false;
        this.isOutOfStockProducts = false;
        this.isAddProduct = false;
        this.isShopHistory = false;
        this.isNorti = false;  
        this.isEditShop = true;
    }

    onSelectNortification() {
        this.isAllProducts = false;
        this.isAvailableProducts = false;
        this.isOutOfStockProducts = false;
        this.isAddProduct = false;
        this.isShopHistory = false;
        this.isEditShop = false;
        this.isNorti = true;  
    }


}
