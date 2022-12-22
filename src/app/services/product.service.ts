import { Injectable } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private api: ApiService,
    private utilityService: UtilityService
  ) {
     
   }
  getAllProductByCategory = (catId) => {
    return  this.api.get(`product/productByCategory/${catId}`).pipe(
      map((res) => {
         return res.body.result;
      }),
      catchError((error) => {
        // TODO:: need to show errors
        // this.utility.showAlert(error.error.message, error.error.status , error.error.status);
        return of (false);
      })
  );
  } 
  getAllProductByProductCategory = (catId) => {
    return  this.api.get(`product/getProductByProductCatId?productCatId=${catId}`).pipe(
      map((res) => {
         return res.body.result;
      }),
      catchError((error) => {
        // TODO:: need to show errors
        // this.utility.showAlert(error.error.message, error.error.status , error.error.status);
        return of (false);
      })
  );
  } 
  getAllProductByBrand = (data) => {
    return  this.api.postRaw(`product/productByBrand`,data).pipe(
      map((res) => {
         return res.body.result;
      }),
      catchError((error) => {
        // TODO:: need to show errors
        // this.utility.showAlert(error.error.message, error.error.status , error.error.status);
        return of (false);
      })
  );
  } 
  getAllBrandByCategory = (catId) => {
    return  this.api.get(`brand/getBrandByCategory/${catId}`).pipe(
      map((res) => {
         return res.body.result;
      }),
      catchError((error) => {
        // TODO:: need to show errors
        // this.utility.showAlert(error.error.message, error.error.status , error.error.status);
        return of (false);
      })
  );
  } 
  filterProduct = (data) => {
    return  this.api.postRaw(`product/filter/`, data).pipe(
      map((res) => {
          return res.body.data;
      }),
      catchError((error) => {
        // TODO:: need to show errors
        // this.utility.showAlert(error.error.message, error.error.status , error.error.status);
        return of (false);
      })
    );
  }
  getProductOnOffers = (data) => {
    return  this.api.postRaw(`offer/productoffer/`, data).pipe(
      map((res) => {
          return res.body.data;
      }),
      catchError((error) => {
        // TODO:: need to show errors
        // this.utility.showAlert(error.error.message, error.error.status , error.error.status);
        return of (false);
      })
    );
  }
  getSearchResult = (filter) => {
     return  this.api.postRaw(`home/getProductsBySearchId?id=${filter.searchResultId}&brandId=${filter.brandId}`, filter).pipe(
      map((res) => {
          return res.body.result;
      }),
      catchError((error) => {
        // TODO:: need to show errors
        // this.utility.showAlert(error.error.message, error.error.status , error.error.status);
        return of (false);
      })
    );
  }
  getSearchResultByKeyoword = (keyword,filter) => {
    // console.log(keyword)
    return  this.api.postRaw(`product/productSearchByKeyword?name=${keyword}`,filter).pipe(
     map((res) => {
          console.log(res)
         return res.body.data;
     }),
     catchError((error) => {
       // TODO:: need to show errors
       // this.utility.showAlert(error.error.message, error.error.status , error.error.status);
       return of (false);
     })
   );
 }
  addItemInWishlist = (data) => {
    return  this.api.postRaw(`/wishlist/`, data).pipe(
      map((res) => {
         this.utilityService.showSnackBar(res, res.status)
         return res.body;
      }),
      catchError((error) => {
        // TODO:: need to show errors
        // this.utility.showAlert(error.error.message, error.error.status , error.error.status);
        return of (false);
      })
    );
  }
  getWishlistItem = () => {
    return  this.api.get(`/wishlist`).pipe(
      map((res) => {
        //  this.utilityService.showSnackBar(res, res.status)
         return res.body;
      }),
      catchError((error) => {
        // TODO:: need to show errors
        // this.utility.showAlert(error.error.message, error.error.status , error.error.status);
        return of (false);
      })
    );
  }
  deleteWishlistItem = (data) => {
    return  this.api.postRaw(`/wishlist/delete`,data).pipe(
      map((res) => {
        //  this.utilityService.showSnackBar(res, res.status)
         return res.body;
      }),
      catchError((error) => {
        // TODO:: need to show errors
        // this.utility.showAlert(error.error.message, error.error.status , error.error.status);
        return of (false);
      })
    );
  }
   
  getOrderById = (id,subOrderId) => {
    return  this.api.get(`order/orderId/${id}/subOrder/${subOrderId}`).pipe(
      map((res) => {
         return res.body;
      }),
      catchError((error) => {
     
        return of (false);
      })
    );
  }
  getReceintViewProduct = () => {
    let data = {
      'productIdList' : []
    }
    data.productIdList 
    let receintviewsProducts = JSON.parse(localStorage.getItem('receintviews'));
    if(receintviewsProducts){
      data.productIdList = [...receintviewsProducts]
    }
   
    return  this.api.postRaw(`home/recentViewProducts`,data).pipe(
      map((res) => {
         return res.body;
      }),
      catchError((error) => {
     
        return of (false);
      })
    );
  }

  getAllProdouctsByVendor = (sellerId) => {
    return  this.api.get(`/product/getSellerProductinfo?sellerId=${sellerId}`).pipe(
      map((res) => {
         return res.body;
      }),
      catchError((error) => {
     
        return of (false);
      })
    );
  }
}
