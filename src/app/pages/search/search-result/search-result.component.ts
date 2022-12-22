import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CONSTANT } from 'src/app/constant';
import { ProductService } from 'src/app/services/product.service';
import { UtilityService } from 'src/app/services/utility.service';
@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {
  showFilter: boolean = false;
  categoryId: string;
  productData: any;
  linkType: any;
  colorArray = CONSTANT.colorArray;
  discountRanges = CONSTANT.discountRanges;
  priceRanges = CONSTANT.priceRanges;
  ratings = CONSTANT.customerRatings;
  brandId: any;
  pageSerachType: string;
  searchId: any;
  toggleGirdView: boolean = false;
  pageBreadCrumb: string[];
  brandDetail: any;
  filter = {
    searchResultId:"",
    price: 'asc',
    brandId: "",
    discount:0,
    price_range: {
      from: 100,
      to: 30000
    },
    productRating: 0
  }
  offerId: any;
  offerAmount: any;
  isSerachingByKeyowrd: boolean;
  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private utilityService: UtilityService
  ) {
     this.router.events.forEach((event) => {

      if(event instanceof NavigationEnd) {
         this.linkType = this.activatedRoute.snapshot.params.offerName;
        this.pageBreadCrumb = window.location.pathname.split('/');
        this.searchId = this.activatedRoute.snapshot.params.id;
        this.filter.searchResultId = this.searchId;
        this.filter.brandId = this.activatedRoute.snapshot.params.brandId;
        if(this.searchId){
          this.isSerachingByKeyowrd = false;
          this.getSearchResult();   
        } else {
          this.isSerachingByKeyowrd = true;
          this.getSearchResultByKeyword(this.filter);
        }
        // this.getAllBrandByCategory();  
       }
    });
   }

  ngOnInit(): void {
    this.brandDetail = [];
    }

  getSearchResult = () =>{
    this.utilityService.showPreloader();
    this.productService.getSearchResult(this.filter).subscribe((res) => {
      if(res){
        this.productData = res;
      }
      this.utilityService.hidePreloader();
    })
  }
  getSearchResultByKeyword = (filter?:any) =>{
    this.utilityService.showPreloader();
    this.productService.getSearchResultByKeyoword(this.activatedRoute.snapshot.params.keywords,filter).subscribe((res) => {
      if(res){
        this.productData = res;
      }
      this.utilityService.hidePreloader();
    })
  }
  // getAllBrandByCategory = () => {
  //   this.utilityService.showPreloader();
  //    if(this.parentCategoryId){
  //     this.brandDetail = []
  //     this.productService.getAllBrandByCategory(this.parentCategoryId).subscribe((res) => {
  //        res.brandRecord.forEach((ele) => {
  //         if(this.filter.productBrand.some(item => item['brandId'] === ele._id)){
  //         ele.isChecked = true;
  //       } else {
  //         ele.isChecked  = false;
  //       }
  //       this.brandDetail.push(ele);
  //     });
  //        this.utilityService.hidePreloader();
  //     })
  //   }
  // }
  filterProduct() {
      this.utilityService.showPreloader();
      const newFilterData = {...this.filter}
      // console.log(this.filter);
      // this.utilityService.hidePreloader();
      // return;
      // newFilterData.productBrand  =  newFilterData.productBrand.map(ele =>   ele = ele.brandId);
      if(this.isSerachingByKeyowrd){
        this.getSearchResultByKeyword(newFilterData);
      }else{
        this.productService.getSearchResult(newFilterData).subscribe((res) => {
          this.utilityService.hidePreloader();
           this.productData = res;
         })
      }
       
  }
  convertPercentageIntoSpace = (ele) => ele.replace(/%20/g, " ").replace(/%7D/g, " ");

  // selectBrand = (event) => {
  //    const brandData = event.value.split("|");
  //   const brand = {
  //     brand: brandData[1],
  //     brandId: brandData[0]
  //   }
  //   if(event.checked){
  //     this.filter.productBrand.push(brand)
  //   } else{
  //     this.removeObject( this.filter.productBrand, brand)
  //   }
  //    this.filterProduct()
  // }
 
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
        // this.removeObject(this.filter.productBrand, data.brandId);
        // this.getAllBrandByCategory();
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
  selectDiscout = (event) => {
    window.scroll(0 , 0 )
    const discount = (event.value * 1);
    if(event.checked){
      this.filter.discount = discount;
      this.filterProduct()
    }
  }
  selectRating = (event) => {
    window.scroll(0 , 0 )
    const rating = (event.value * 1);
    this.filter.productRating = rating;
    this.filterProduct()
  }
}
