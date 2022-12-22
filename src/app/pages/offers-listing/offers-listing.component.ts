import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CONSTANT } from 'src/app/constant';
import { ProductService } from 'src/app/services/product.service';
import { UtilityService } from 'src/app/services/utility.service';
@Component({
  selector: 'app-offers-listing',
  templateUrl: './offers-listing.component.html',
  styleUrls: ['./offers-listing.component.scss']
})
export class OffersListingComponent implements OnInit {
  categoryId: string;
  productData: any;
  linkType: any;
  colorArray = CONSTANT.colorArray;
  discountRanges = CONSTANT.discountRanges;
  priceRanges = CONSTANT.priceRanges;
  ratings = CONSTANT.customerRatings;
  brandId: any;
  pageSerachType: string;
  parentCategoryId: any;
  toggleGirdView: boolean = false;
  pageBreadCrumb: string[];
  brandDetail: any;
  filter = {
    offerId:"",
    productRating: 0,
    categoryId:"",
    offersAmount:"",
    price:"asc",
    productBrand: [],
    price_range: {
        from: 100,
        to: 9000,
    }
  }
  offerId: any;
  offerAmount: any;
  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private utilityService: UtilityService
  ) {
     this.router.events.forEach((event) => {

      if(event instanceof NavigationEnd) {
         this.filter.productBrand= []; 
        this.linkType = this.activatedRoute.snapshot.params.offerName;
        this.pageBreadCrumb = window.location.pathname.split('/');
        this.parentCategoryId = this.activatedRoute.snapshot.params.catid;
         this.filter.categoryId = this.parentCategoryId;
        this.filter.offersAmount =  this.activatedRoute.snapshot.params.offerAmount;
        this.offerId = this.activatedRoute.snapshot.params.offerId;
        this.filter.offerId = this.offerId
        this.offerAmount = this.activatedRoute.snapshot.params.offerAmount;
        // this.filter.subCategroy = this.categoryId;
        this.getProductOnOffers();    
        this.getAllBrandByCategory();  
       }
    });
   }

  ngOnInit(): void {
    this.brandDetail = [];
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

  getAllBrandByCategory = () => {
    this.utilityService.showPreloader();
     if(this.parentCategoryId){
      this.brandDetail = []
      this.productService.getAllBrandByCategory(this.parentCategoryId).subscribe((res) => {
         res.brandRecord.forEach((ele) => {
          if(this.filter.productBrand.some(item => item['brandId'] === ele._id)){
          ele.isChecked = true;
        } else {
          ele.isChecked  = false;
        }
        this.brandDetail.push(ele);
      });
         this.utilityService.hidePreloader();
      })
    }
  }
  filterProduct() {
      this.utilityService.showPreloader();
      const newFilterData = {...this.filter}
      newFilterData.productBrand  =  newFilterData.productBrand.map(ele =>   ele = ele.brandId);
       this.productService.getProductOnOffers(newFilterData).subscribe((res) => {
       this.utilityService.hidePreloader();
      this.productData = res;
    })
  }
  convertPercentageIntoSpace = (ele) => ele.replace(/%20/g, " ");

  selectBrand = (event) => {
     const brandData = event.value.split("|");
    const brand = {
      brand: brandData[1],
      brandId: brandData[0]
    }
    if(event.checked){
      this.filter.productBrand.push(brand)
    } else{
      this.removeObject( this.filter.productBrand, brand)
    }
     this.filterProduct()
  }
 
    selectPrice = (event) => {
        window.scroll(0 , 0 );
        const priceRange = event.value.split('/');
         if(event.checked){
            this.filter.price_range.from = (priceRange[0] * 1);
            this.filter.price_range.to = (priceRange[1] * 1);
            this.filterProduct()
        }
    }

  onSortPrice = (event) => {
     this.filter.price = event;
    this.filterProduct()
  }
  clearFillter = () => {
    this.utilityService.refresh();
  }
  removeFilter = (data?:any, filterType?:string) => {
     switch (filterType) {
      case 'brand':
        this.removeObject(this.filter.productBrand, data.brandId);
        this.getAllBrandByCategory();
        break;
      default:
        break;
    }
    this.filterProduct();
  }

  removeObject = (arr, taget) => {
    let  index = arr.findIndex(
      (i) => i.x === taget.x
    )
    
    if (index !== -1) {
      arr.splice(
        index, 1
      );
    }  
    return arr;  
  }
  removeElementFilterArray = (arr, target) => {
    const tmpArray = []
    arr.forEach((item) => {
      if(item !== target) {
        tmpArray.push(item)
      }
    })
   return tmpArray;
  }
  selectRating = (event) => {
    window.scroll(0 , 0 )
    const rating = (event.value * 1);
    this.filter.productRating = rating;
    this.filterProduct()
  }
}
