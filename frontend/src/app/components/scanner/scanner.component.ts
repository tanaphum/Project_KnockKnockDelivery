import { Component, ViewChild, OnInit, ElementRef, Renderer2,ViewEncapsulation } from '@angular/core';
import {QrScannerComponent} from 'angular2-qrscanner';
import { Router } from '@angular/router';
import { OrderService } from './../../services/order.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css'],
  encapsulation: ViewEncapsulation.None,


})
export class ScannerComponent implements OnInit {

  elementType = 'url';
  value = 'https://assets.econsultancy.com/images/resized/0002/4236/qr_code-blog-third.png';

  @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent ;
  @ViewChild('result') resultElement: ElementRef;
  
  showQRCode: boolean = true;
  constructor(
    private renderer: Renderer2,
    private router: Router,
    private OrderService: OrderService,

  ) {

  }
  ngOnInit() {
    this.qrScannerComponent.getMediaDevices()
    .then(devices => {
        console.log(devices);
        const videoDevices: MediaDeviceInfo[] = [];
        for (const device of devices) {
            if (device.kind.toString() === 'videoinput') {
                videoDevices.push(device);
            }
        }
        if (videoDevices.length > 0){
            let choosenDev;
            for (const dev of videoDevices){
                if (dev.label.includes('front')){
                    choosenDev = dev;
                    break;
                }
            }
            if (choosenDev) {
                this.qrScannerComponent.chooseCamera.next(choosenDev);
            } else {
                this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
            }
        }
    });

    this.qrScannerComponent.capturedQr.subscribe(result => {
      console.log(result);
      this.reader(result)
    });

  }

  reader(result) {
    console.log('[reader]',result);
    this.router.navigateByUrl('/qr-code-result')

  }

  render(e) {
    console.log(e.result);
    let element: Element = this.renderer.createElement('p');
    element.innerHTML = e.result;
    this.renderElement(element);
  }

  renderElement(element) {
    for (let node of this.resultElement.nativeElement.childNodes) {
      this.renderer.removeChild(this.resultElement.nativeElement, node);
    }
    this.renderer.appendChild(this.resultElement.nativeElement, element);
  }

  scan_seller() {
    let order = JSON.parse(localStorage.getItem('order'))
    let body = {
      order_status_id:5
    }
    this.OrderService.QRcodeUpdateStatusOrderByOrderId(order.order_id,body)
    .subscribe(response => {
      console.log('[reeponse] scan_seller',response);
      alert('Success scan@seller')
    },error => {
      console.log('[error] scan_seller',error);
      alert('Fail scan@seller')

    })
  }

  scan_buyer() {
    let order = JSON.parse(localStorage.getItem('order'))
    let body = {
      order_status_id:6
    }
    this.OrderService.QRcodeUpdateStatusOrderByOrderId(order.order_id,body)
    .subscribe(response => {
      console.log('[reeponse] scan_buyer',response);
      alert('Success scan@buyer')

    },error => {
      console.log('[error] scan_buyer',error);
      alert('Fail scan@buyer')

    })
  }
}
