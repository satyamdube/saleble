import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { HomeService } from 'src/app/services/home.service';
import { UtilityService } from 'src/app/services/utility.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { ApiService } from 'src/app/services/api.service';
import { ReviewService } from 'src/app/services/review.service';
import { CONSTANT } from 'src/app/constant';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  public productThumbnailArray: string[];
  public showBigModel: boolean;
  tempFlag: boolean;
  productId: string;
  showReviewModal: boolean;
  selectedImg: any;
  selectedImgIndex: number;
  previewImageSrc: any;
  zoomImageSrc: any;
  tabindex = 1;
  public outOfStock = CONSTANT.outOfStock;
  productQuantity: number = 1;
  productStockQuantityFromServer: number;
  productDetail: any;
  productAttributes: any = {};
  isLoggedIn: any;
  loggedInUserData: any;
  isAddedOnWishlist: any;
  productRating: any;
  ratingArray: number[];
  reviewList: any;
  similarProductData: any;
  prodouctBreadCrumb: any;
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
    nav: false
  }
  selectedReview: any;
  productPrice = {
    productSalePrice: 0,
    productRegPrice: 0,
    productDiscount: '',
  };
  attributeArray: {};
  variationFilter:any;
  constructor(
    private homeService: HomeService,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private authService: AuthService,
    private cartService: CartService,
    private productService: ProductService,
    private api: ApiService,
    private reviewService: ReviewService,
    private utilityService: UtilityService,
    private router: Router,
  ) {

    this.authService.userSubject.subscribe((res) => {
      this.isLoggedIn = res;
      if (this.isLoggedIn) {
        this.getLoggedInUserData();
      }
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.productId = this.activatedRoute.snapshot.params.id;
        // Hide progress spinner or progress bar
        if (this.productId) {
          this.initializeAllFunction();
        }
      }
    });
    if (this.productId) {
      this.initializeAllFunction();
    }
    this.selectedImgIndex = 0;
  }
  ngOnInit(): void {
  
  }
  initializeAllFunction = () => {
    this.getProductDetail();
    this.setReceintViewProducts();
    this.getSimillarProducts();
    this.getProdouctBreadCrumb();
    this.ratingArray = [];
    this.productThumbnailArray = [];
    this.tempFlag = true;
    this.getReview();
    this.getRating();
    this.attributeArray = {};
    this.variationFilter = '';
  }
  getReview = () => {
    this.reviewService.getReviewByProduct(this.productId).subscribe((res) => {
      if (res) {
        // console.log(res)
        this.reviewList = res.review;
        // console.log(this.reviewList);
      }
    })
  }
  getRating = () => {
    this.reviewService.getProductRating(this.productId).subscribe((res) => {
      if (res) {
        this.productRating = res;
      }
    })
  }
  public viewHoverImg = (img, index) => {
    this.selectedImg = img;
    this.selectedImgIndex = index;
    this.previewImageSrc = img;
    this.zoomImageSrc = img;
  }
  openDescTab = (tabindex) => {
    this.tabindex = tabindex;
  }

  getProductDetail = () => {
     this.homeService.getProductById(this.productId).subscribe((res) => {
      // res.productVariations = res.data.productVariations.map((v) => v.variationTitle.replace(/\s/g,''));
      this.productDetail = res.data;
      console.log(this.productDetail);
      this.productPrice = {
        productSalePrice: this.productDetail.productSalePrice,
        productRegPrice: this.productDetail.productRegPrice,
        productDiscount: this.productDetail.productDiscount,
      };
       
      this.isAddedOnWishlist = res.isAddedOnWishlist;
      const tmpData = res.data;
      this.productStockQuantityFromServer = tmpData.productStockQuantity >= 10 ? 10 : tmpData.productStockQuantity;
      tmpData.productAttributes.forEach((item) => {
        this.productAttributes[item.title] = '';
      });
      this.productDetail.productRating = res.data.productRating ? Math.floor(res.data.productRating) : 0;
      for (let index = 0; index < Math.floor(res.data.productRating); index++) {
        this.ratingArray.push(index + 1);
      }
      tmpData.selectedAttributes = [];
      this.titleService.setTitle(tmpData.productName);
      if (!this.isEmpty(tmpData.productImages[0])) {
        this.productThumbnailArray = [...tmpData.productImages];
      } else {
        this.productThumbnailArray = []
      }
      if (tmpData.productAttributes){
        this.selectedImg = this.productThumbnailArray[0];
      }
       
    })
  }

  isEmpty = (obj) => {
    if (obj !== null || obj !== undefined) {
      return Object.keys(obj).length === 0;
    }
  }

  onSelectAttribute = (attributeValue, attributename) => {  
    this.utilityService.showPreloader();  
    this.productAttributes[attributename] = attributeValue;
    this.productDetail.productVariations = this.productDetail.productVariations ? this.productDetail.productVariations : [];
    this.attributeArray[`item${attributename}`] = attributeValue
    console.log(this.attributeArray);
    if( this.productDetail.productVariations){
      let result

      this.filterVariations(this.attributeArray, this.productDetail.productVariations);          
    }
    this.utilityService.hidePreloader();  
  }
  filterVariations = (attribute, variationData) => {
      this.variationFilter = ''
      for (const iterator of Object.values(attribute)) {
        console.log(iterator);
         this.variationFilter += `${iterator} | `;
      }
      console.log(variationData);
     let result;
    //  Object.keys(variationData).forEach(function(key) {
    //   if (variationData[key] == 'test1') {
    //     alert('exists');
    //   }
    // });
      result = variationData.filter(variation => variation.variationTitle.includes(this.variationFilter))[0];
     if(!result){
       console.log('result not found');
      this.variationFilter =   this.reverseString(this.variationFilter);
      // console.log(this.variationFilter);
      result = variationData.filter(variation => {
        const key1 = variation.variationTitle.replace(/[ ]+/g, "");
        const key2 = (this.variationFilter + ' | ').replace(/[ ]+/g, ""); 

        console.log(key1);
        console.log(key2);
        if(key1 == key2){
          console.log('match');
          
          return variation;
        }
      })[0];
     }
     console.log(result);
    //  result = result[0] ? result[0] : result;
      if(result){
        if(result.variationImages.length >= 1){
          this.productThumbnailArray = result.variationImages;
          this.selectedImg = this.productThumbnailArray[0]
        } else{
          this.productThumbnailArray = this.productDetail.productImages;
          this.selectedImg = this.productThumbnailArray[0]
        }
        
        if(result.variationRegularPrice && result.variationSalePrice){
          this.productPrice.productRegPrice = (result.variationRegularPrice * 1);
          this.productPrice.productSalePrice  = (result.variationSalePrice * 1);
          this.productPrice.productDiscount = this.calcuateDiscount(this.productPrice.productRegPrice, this.productPrice.productSalePrice)
        } else if(result.variationRegularPrice){
          this.productPrice.productRegPrice = (result.variationRegularPrice * 1);
          this.productPrice.productSalePrice  = this.productDetail.productSalePrice;
          this.productPrice.productDiscount = this.calcuateDiscount(this.productPrice.productRegPrice, this.productPrice.productSalePrice)
        } else if(result.variationSalePrice){
          this.productPrice.productRegPrice = this.productDetail.productRegPrice;
          this.productPrice.productSalePrice  = (result.variationSalePrice * 1);
          this.productPrice.productDiscount = this.calcuateDiscount(this.productPrice.productRegPrice, this.productPrice.productSalePrice)
        } else{
          this.productPrice.productRegPrice = this.productDetail.productRegPrice;
          this.productPrice.productSalePrice  =  this.productDetail.productSalePrice;
          this.productPrice.productDiscount = this.productDetail.productDiscount;
        }
      }  
  }
 reverseString(str) {
   let tmpData;
    if (str === "")
      return "";
    else{
     tmpData = str.split('|').reverse();      
    //  console.log(tmpData);     
      var res =  tmpData.slice(1).join(' | ');
     return res;
    }
      // return this.reverseString(str.substr(1)) + str.charAt(0);
  }
 
    calcuateDiscount = (productRegPrice,productSalePrice ) => {
      let  discount = ((((productRegPrice * 1) - (productSalePrice * 1)) / (productRegPrice * 1)) * 100).toFixed(0);
      return discount;
    }
  addToCart = (productData, productQuantity) => {
    if (productQuantity === 0) {
      return;
    }
    this.cartService.addItemIntoCart(productData, this.productAttributes, this.productQuantity, this.isLoggedIn ? 'true' : 'false', this.loggedInUserData);
  }
  wishListItem = (productData) => {
    if (!this.isLoggedIn) {
      this.cartService.showLoginModal.next(true)
    } else {
      const data = {
        productId: productData._id,
      }
      this.productService.addItemInWishlist(data).subscribe((res) => {
        this.utilityService.refresh();
      })
    }
  }

  getLoggedInUserData = () => {
    this.api.get('/user/me').subscribe((res) => {
      this.loggedInUserData = res.body;
    })
  }
  isRated = (ratingIndex) => {
    let flag = false;
    if (this.ratingArray.includes(ratingIndex + 1)) {
      return flag = true;
    }
  }
  scroll(el: HTMLElement) {
    this.tabindex = 3;
    el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }

  setReceintViewProducts = () => {
    const receintViewArray = []
    let recentView = JSON.parse(localStorage.getItem('receintviews'));
    if (recentView) {
      recentView.push(this.productId);
      localStorage.setItem('receintviews', JSON.stringify(recentView))
    } else {
      receintViewArray.push(this.productId)
      localStorage.setItem('receintviews', JSON.stringify(receintViewArray))
      // creating new array
    }
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
  getSimillarProducts = () => {
    this.utilityService.showPreloader();
    this.homeService.getSimillarProducts(this.productId).subscribe((res) => {
      this.utilityService.hidePreloader();
    })
  }
  getProdouctBreadCrumb = () => {
    this.homeService.getProductBreadcrumb(this.productId).subscribe((res) => {
      this.prodouctBreadCrumb = res;
    })
  }
  openReviewModal = (data, index) => {
    this.showReviewModal = true;
    // console.log(data);
    if(data.customerName){
      this.selectedReview = data;
    } else {
      data.customerName = `${data.customerId.f_name} ${data.customerId.l_name}`
      this.selectedReview = data;
    }
    this.selectedReview['index'] = index;
    // console.log(this.selectedReview);
  }
  scrollReview = (index, scrollType) => {
    // console.log(index);
    // console.log(scrollType);
    if(scrollType === 'prev'){
      console.log(this.reviewList[index-1]);
      if(typeof this.reviewList[index-1] !== 'undefined')
        this.openReviewModal(this.reviewList[index-1], index-1);
      else
      this.openReviewModal(this.reviewList[this.reviewList.length-1], this.reviewList.length-1);
      
    } else {
      console.log(this.reviewList[index+1]);
      if(typeof this.reviewList[index+1] !== 'undefined')
        this.openReviewModal(this.reviewList[index+1], index+1);
      else
      this.openReviewModal(this.reviewList[0], 0);
    }
  }
}
