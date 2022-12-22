import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HomeService } from 'src/app/services/home.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public firstGridListing: any[];
  menProducts: any;
  womenProducts: any;
  babyProducts: any;
  dealOfTheDay: any;
  offerListings: any;
  allOffers: any;
  electronicsSubCategory: any;
  beautyCare: any;
  fashionSubcategory: any;
  electronicsProducts: any;
  babyToysSubcategory: any;
  sportProducts: any;
  sportSubcategory: any;
  homeAndKitchenSubcategory: any;
  homeAndKitchensProducts: any;
  beautyAndCare: any;
  automotive: any;
  automotiveSubCategory: any;
  constructor(
    private homeService: HomeService,
    private router: Router,
    private utilityService: UtilityService,
  ) { }

  ngOnInit(): void {
    this.getAllProduct();
    this.getDealOfTheDay();
    this.getAllOffers();
    this.getCategoryByCategoryName();
  }
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    autoplay: true,
    autoplayHoverPause: true,
    autoplaySpeed: 3000,
    navSpeed: 1000,
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
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true
  }
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
        items: 3
      },
      940: {
        items: 6
      }
    },
    nav: true
  }

 
  threeCardCarousel: OwlOptions = {
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
        items: 2
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 3
      }
    },
    nav: true
  }
  getAllProduct = () => {
    this.utilityService.showPreloader();
    this.homeService.getAllProducts().subscribe((res) => {
         this.menProducts = res[1];
        //  this.womenProducts = res[0];
        this.babyProducts = res[2];
        this.beautyCare = res[4];
        this.sportProducts = res[6];
        this.electronicsProducts = res[0];
        this.homeAndKitchensProducts = res[3];
        this.automotive = res[5];
        this.utilityService.hidePreloader();    
             
     })
  }
  getDealOfTheDay = () => {
    this.homeService.getDealOfTheDay().subscribe((res) => {
      this.dealOfTheDay = res;
     })
  }
  getAllOffers = () => {
    this.homeService.getAllOffers().subscribe((res) => {
      this.allOffers = res;
     })
  }
  
  reditectToOffer = (offerData) => {
    offerData.title = offerData.title.replace(/ +/g, "-");
    this.router.navigateByUrl(`offers/${offerData.title}/${offerData._id}/${offerData.categoryId}/${offerData.offersAmount}`)
  }
  getCategoryByCategoryName = () => {
    this.utilityService.showPreloader();
    // const categoryByName = ['electronics', '']
    this.homeService.getCategoryByCategoryName('electronics').subscribe((res) => {
      
      this.electronicsSubCategory = res;
      this.utilityService.hidePreloader();
    });
    this.homeService.getCategoryByCategoryName('fashion').subscribe((res) => {
      
      this.fashionSubcategory = res;
      this.utilityService.hidePreloader();
    });

    this.homeService.getCategoryByCategoryName('baby-toys').subscribe((res) => {
      
      this.babyToysSubcategory = res;
      this.utilityService.hidePreloader();
    });
    this.homeService.getCategoryByCategoryName('sports').subscribe((res) => {
      
      this.sportSubcategory = res;
      this.utilityService.hidePreloader();
    });
    
    this.homeService.getCategoryByCategoryName('home-kitchen').subscribe((res) => {
      
      this.homeAndKitchenSubcategory = res;
      this.utilityService.hidePreloader();
    });
    this.homeService.getCategoryByCategoryName('beauty-care').subscribe((res) => {
      
      this.beautyAndCare = res;
      this.utilityService.hidePreloader();
    });   
    this.homeService.getCategoryByCategoryName('automotive').subscribe((res) => {
      
      this.automotiveSubCategory = res;
      this.utilityService.hidePreloader();
    }); 
  }
}
