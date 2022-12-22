import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { UtilityService } from 'src/app/services/utility.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  catId: any;
  offerDetail: any;
  subCategoryDetail: any;
  productData: any;
  filter = {
    offerId:"",
    categoryId:"",
    offersAmount:"",
    price:"asc",
    productBrand: [],
    price_range: {
        from: 100,
        to: 9000,
    }
  }
  categoryDetail: any;
  constructor(
    private homeService: HomeService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private utilityService: UtilityService,
    private productService: ProductService
  ) { 
    this.router.events.forEach((event) => {

      if(event instanceof NavigationEnd) {
        this.catId = this.activatedRoute.snapshot.params.id;    
        this.getCategoryById();
        this.getOfferByCategory();      
       }
    });
  }

  ngOnInit(): void {
   
  }

  getCategoryById = () => {
    this.utilityService.showPreloader();
    this.homeService.getCategoryById(this.catId).subscribe((res) => {
      this.subCategoryDetail = res.subCategory;
      this.categoryDetail = res;      
      this.utilityService.hidePreloader();
    })
  }
  getOfferByCategory = () => {
    this.utilityService.showPreloader();
    this.homeService.getOfferByCategory(this.catId).subscribe((res) => {
      this.offerDetail = res;
       if(res){
        this.filter.categoryId = res.categoryId._id;
        this.filter.offersAmount =  res.offersAmount;
        this.filter.offerId = res._id;
        this.getProductOnOffers();   
      }
     
      this.utilityService.hidePreloader();
    })
  }
  reditectToOffer = (offerData) => {
     offerData.title = offerData.title.replace(/ +/g, "-");
    this.router.navigateByUrl(`offers/${offerData.title}/${offerData._id}/${offerData.categoryId._id}/${offerData.offersAmount}`)
  }
  getProductOnOffers = () =>{
    this.utilityService.showPreloader();
    this.productService.getProductOnOffers(this.filter).subscribe((res) => {
      if(res){
         this.productData = res;
      }
      this.utilityService.hidePreloader();
    })
  }
}
