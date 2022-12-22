import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-receint-view-products',
  templateUrl: './receint-view-products.component.html',
  styleUrls: ['./receint-view-products.component.scss']
})
export class ReceintViewProductsComponent implements OnInit {
  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    autoplay: true,
    autoplayHoverPause: true,
    autoplaySpeed: 300,
    navSpeed: 700,
    navText: 
    [
      '<span class="feather-chevron-left">',
      '<span class="feather-chevron-right">',
    ],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 6
      },
      740: {
        items: 6
      },
      940: {
        items: 6
      }
    },
    nav: true
  }
  receintViewProduct: any;
  constructor(
    private productService: ProductService,
  ) { }

  ngOnInit(): void {
    this.productService.getReceintViewProduct().subscribe((res) => {
       if(res){
        this.receintViewProduct = res;
      }
    })
  }

  viewProudctDetail = (product) =>{
    const href= `/product-detail/${product.productName}/${product._id}`;
    window.open(
      href,
      '_blank' // <- This is what makes it open in a new window.
    );
  }
}
