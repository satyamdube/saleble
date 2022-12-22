import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CONSTANT } from 'src/app/constant';
import { ProductService } from 'src/app/services/product.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-vendor-complete-prodcuts',
  templateUrl: './vendor-complete-prodcuts.component.html',
  styleUrls: ['./vendor-complete-prodcuts.component.scss']
})
export class VendorCompleteProdcutsComponent implements OnInit {
  sellerId: any;
  sellerData: any;
  outOfStock = CONSTANT.outOfStock;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private utilityService: UtilityService
  ) { 
    this.sellerId = this.activatedRoute.snapshot.params.id;
  }

  ngOnInit(): void {
  this.getSellerProductinfo();
  }

  getSellerProductinfo = () => {
    this.utilityService.showPreloader();
     this.productService.getAllProdouctsByVendor(this.sellerId).subscribe((res) => {
      if(res) {
        console.log(res)
        // res.rating.five = 150;
        this.sellerData = res;
      };
      this.utilityService.hidePreloader();
    })
  }
  shareMyProducts = () => {
    const productUrl = window.location.href;
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (productUrl));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    this.utilityService.showCartMessage('link  has been copied to clipboard successfully', 'Success')
  }

}
