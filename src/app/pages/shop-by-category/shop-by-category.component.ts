import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HomeService } from 'src/app/services/home.service';
 
@Component({
  selector: 'app-shop-by-category',
  templateUrl: './shop-by-category.component.html',
  styleUrls: ['./shop-by-category.component.scss']
})
export class ShopByCategoryComponent implements OnInit {
  categoryList: any;

  constructor(
    private homeService: HomeService,
  ) { }

  ngOnInit(): void {
    this.getAllProductCategory();
  }
  shopByCategory: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    autoplay: false,
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
        items: 4
      },
      400: {
        items: 5
      },
      740: {
        items: 6
      },
      940: {
        items: 8
      }
    },
    nav: false
  }
  getAllProductCategory = () => {
    this.homeService.getAllProductCategory().subscribe((res) => {

        this.categoryList = res;
     })
  }
  naviagte = () =>{
    // ../../{{item.name}}/{{item._id}}
    // this.router.navigate(['../child2'],this.segment);

  }

}
