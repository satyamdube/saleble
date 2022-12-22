import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-similar-products',
  templateUrl: './similar-products.component.html',
  styleUrls: ['./similar-products.component.scss']
})
export class SimilarProductsComponent implements OnInit {
  similarProducts: string;
  product_carousel: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    autoplay: false,
    autoplayHoverPause: true,
    autoplaySpeed: 300,
    navSpeed: 700,
    autoWidth:true,
    navText: 
    [
      '<span class="feather-chevron-left">',
      '<span class="feather-chevron-right">',
    ],
    responsive: {
      0: {
        items: 2
      },
      400: {
        items: 2
      },
      740: {
        items: 5
      },
      940: {
        items: 5
      }
    },
    nav: true
  }
  constructor(
    private homeService: HomeService,
  ) { 
      this.homeService.similarProducts$.subscribe((res:any) => {
        console.log(res.data);
        this.similarProducts = res.data;
      });
  }

  ngOnInit(): void {
  }
  openProductDetail  = (productName, productId) => {
    // console.log(productName);
    // console.log(productId);
    // return;
    if(productName && productId) {
      window.location.href = `/product-detail/${productName}/${productId}`
    } else {
      console.log(productName);
      console.log(productId);
    }
  }
}
