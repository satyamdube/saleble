import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CONSTANT } from 'src/app/constant';
import { ProductService } from 'src/app/services/product.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-products-listing',
  templateUrl: './products-listing.component.html',
  styleUrls: ['./products-listing.component.scss']
})
export class ProductsListingComponent implements OnInit {
  categoryId: string;
  showFilter:  boolean = false;
  productData: any;
  linkType: any;
  colorArray = CONSTANT.colorArray;
  discountRanges = CONSTANT.discountRanges;
  priceRanges = CONSTANT.priceRanges;
  ratings = CONSTANT.customerRatings;
  outOfStock = CONSTANT.outOfStock;
  brandId: any;
  pageSerachType: string;
  parentCategoryId: any;
  toggleGirdView: boolean = false;
  pageBreadCrumb: string[];
  brandDetail: any;
  filter = {
    discount : 0,
    price: 'asc',
    productRating: 0,
    new_arrivals: 'asc',
    productAttributes: [],
    parentCategory: '',
    subCategroy: '',
    productCategroy: '',
    productBrand: [],
    price_range: {
        from: 0,
        to: 200000,
    }
  }
  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private utilityService: UtilityService
  ) {
     this.router.events.forEach((event) => {

      if(event instanceof NavigationEnd) {
        console.log(this.activatedRoute.snapshot.params);
        
          this.filter.productBrand= []; 
        this.filter.productAttributes= []; 
        this.linkType = this.activatedRoute.snapshot.params.productCategoryName ? this.activatedRoute.snapshot.params.productCategoryName : this.activatedRoute.snapshot.params.subCategoryName;
        this.pageBreadCrumb = window.location.pathname.split('/');
        // console.log(this.pageBreadCrumb)
         if(window.location.pathname.split('/').includes('brand')){
          this.pageSerachType = 'brand'
        } else {
          this.pageSerachType = 'category';
        }
        
         if(this.pageSerachType === 'brand'){
          this.brandId = this.activatedRoute.snapshot.params.id;
          this.parentCategoryId = this.activatedRoute.snapshot.params.catid;
          this.filter.parentCategory = this.parentCategoryId;
          // Clear array on page load
           this.filter.productBrand.push({
            brand: this.linkType,
            brandId: this.brandId
          });
            this.filterProduct();
        } else if(this.pageBreadCrumb.length >= 9 ) {
          // console.log(this.pageSerachType);
          this.categoryId = this.activatedRoute.snapshot.params.id;
          this.parentCategoryId = this.activatedRoute.snapshot.params.catid;
          this.filter.parentCategory = this.parentCategoryId;
          this.filter.subCategroy = this.activatedRoute.snapshot.params.subCatId;
          this.filter.productCategroy = this.categoryId;
          // console.log(this.filter.subCategroy);
          
          this.getProductByCategoryId();
        } else {
          // console.log(this.pageSerachType);
          this.categoryId = this.activatedRoute.snapshot.params.id;
          this.parentCategoryId = this.activatedRoute.snapshot.params.catid;
          this.filter.parentCategory = this.parentCategoryId;
          this.filter.subCategroy = this.categoryId;
          //  console.log(this.filter.subCategroy);
           this.getProductByCategoryId();

        }
        this.getAllBrandByCategory();      

      }
    });

   }

  ngOnInit(): void {
    this.brandDetail = [];
    }

  getProductByCategoryId = () =>{
    this.utilityService.showPreloader();
    this.productService.getAllProductByCategory(this.categoryId).subscribe((res) => {
      if(res){
        this.productData = res;
        this.utilityService.hidePreloader();
      }
    })
  }
  getProductByProductCategoryId = (productId) =>{
    this.utilityService.showPreloader();
    this.productService.getAllProductByProductCategory(productId).subscribe((res) => {
      if(res){
        this.productData = res;
        this.utilityService.hidePreloader();
      }
    })
  }

  getAllBrandByCategory = () => {
    this.utilityService.showPreloader();
     let catId;
     if(this.activatedRoute.snapshot.url[5] && this.activatedRoute.snapshot.url[5].path === "productCategory"){
      catId = this.activatedRoute.snapshot.url[2].path;
      this.getProductByProductCategoryId( this.activatedRoute.snapshot.url[7].path);
    }else{
       catId = this.activatedRoute.snapshot.params.catid ? this.activatedRoute.snapshot.params.catid: this.parentCategoryId;

    }
    if(catId){
      this.brandDetail = []
      this.productService.getAllBrandByCategory(catId).subscribe((res) => {
        if(res){
          res.brandRecord.forEach((ele) => {
            if(this.filter.productBrand.some(item => item['brandId'] === ele._id)){
            ele.isChecked = true;
          } else {
            ele.isChecked  = false;
          }
          this.brandDetail.push(ele);
        });
        }
       
         this.utilityService.hidePreloader();
      })
    }
  }
  filterProduct() {
      this.utilityService.showPreloader();
      const newFilterData = {...this.filter}
      newFilterData.productBrand  =  newFilterData.productBrand.map(ele =>   ele = ele.brandId);
      this.productService.filterProduct(newFilterData).subscribe((res) => {
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
    selectPrice = (event) => {
        window.scroll(0 , 0 );
        const priceRange = event.value.split('/');
         if(event.checked){
            this.filter.price_range.from = (priceRange[0] * 1);
            this.filter.price_range.to = (priceRange[1] * 1) === 9000 ? 200000 : (priceRange[1] * 1) ;
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
        this.removeObject(this.filter.productBrand, data);
        this.getAllBrandByCategory();
        break;
      case 'discount':
        this.filter.discount = 0;
        this.getAllBrandByCategory();
        break;
      // case 'color':
      //   const fillteredColor = this.removeElementFilterArray(this.filter.productAttributes, data)
      //   this.filter.productAttributes = [];
      //   this.filter.productAttributes = [...fillteredColor];
      //   console.log(this.colorArray)
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
}
