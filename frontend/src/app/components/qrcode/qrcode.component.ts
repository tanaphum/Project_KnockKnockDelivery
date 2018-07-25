import { Component, ViewChild, OnInit, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})
export class QRcodeComponent implements OnInit {

  elementType = 'url';
  value = 'https://assets.econsultancy.com/images/resized/0002/4236/qr_code-blog-third.png';

  @ViewChild('result') resultElement: ElementRef;

  showQRCode: boolean = true;

  constructor(private renderer: Renderer2) {

  }

  ngOnInit() {
  }
  
  render(e) {
    console.log('[render] ',e.result);
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

}
