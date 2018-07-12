import { Component, OnInit,ViewChild } from '@angular/core';
import { DeliverService } from '../../services/deliver.service';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-deliver',
  templateUrl: './deliver.component.html',
  styleUrls: ['./deliver.component.css']
})
export class DeliverComponent implements OnInit {

  private deliver_profile;
  private isShow:boolean = true;
  private isUpdate:boolean = false;
  private form = {
    bank_account_id:null,
    bank_account_no:null,
    profile_status_id:null,
    shipper_transfer_slip:null,
    selected_bank:null

  }
  private dafault_bank;
  private error;
  private orders = [];
  private bankAcc;
  @ViewChild("mycanvas") mycanvas;

  constructor(
    private deliverService: DeliverService,
    private orderService: OrderService,
    private router: Router

  ) { }

  ngOnInit() {
    this.getProfile();
    this.setBankAccount();
    this.getAllOrder();
  }

  openOrderInfo() {
    
  }

  onBankSelected(event) {
    console.log("onBankSelected", event)
    this.form.bank_account_id = parseInt(event);
  }

  setBankAccount() {
    this.bankAcc = JSON.parse(localStorage.getItem('masterData')).bank_account;
  }

  preview(e: any): void {
    let canvas = this.mycanvas.nativeElement;
    let context = canvas.getContext('2d');
    context.clearRect(0, 0, 300, 300);

    //Show render image to canvas
    var render = new FileReader();
    render.onload = function (event) {
      var img = new Image();
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0)
        // context.drawImage(img,0,0,400,400)

      }
      // img.src = event.target.result;
    };
    render.readAsDataURL(e.target.files[0]);


  }

  getProfile() {
    let id = localStorage.getItem('seller_id');
    this.deliverService.getDeliverByProfileId(id)
    .subscribe(
      response => {
        console.log("[response] ",response)
        this.deliver_profile = response.data[0]
        this.form.bank_account_id = response.data[0].bank_account.bank_account_id;
        this.form.bank_account_no = response.data[0].bank_account_no;
        this.form.profile_status_id = response.data[0].profile_status.profile_status_id;

        this.bankAcc.forEach((element, idx) => {
          if (element.bank_account_id == this.form.bank_account_id) {
            this.dafault_bank = idx + 1;
            this.form.selected_bank = idx + 1;
          }    
        });


      },
      error => {
        console.log("[response] ",error)

      }
    )
  }

  openProfile() {
    console.log("[Deliver profile]")
  }

  onUpdateProfile() {
    console.log("[Update]")
    let id = this.deliver_profile.shipper_id;
    let form = {
      bank_account_id:this.form.bank_account_id,
      bank_account_no:this.form.bank_account_no,
      shipper_transfer_slip:null,
      // profile_status_id:this.form.profile_status_id
    }
    this.deliverService.updateDeliver(form,id)
    .subscribe(response => {
      console.log("[Response] ",response)
    },
    error => {
      console.log("[Error] ",error)

    })
  }

  getAllOrder() {
    this.orderService.getOrders()
    .subscribe(response => {
      console.log("[Response] ",response.data)
      this.orders = response.data
      this.isShow = !this.isShow

    },error => {
      console.log("[Error] ",error)
    })
  }

  gotoShop(seller) {
    console.log("[Go to shop] ",seller)
    localStorage.setItem('seller_order_id',seller.seller_id)
    this.router.navigateByUrl('/deliver-order')

  }

}
