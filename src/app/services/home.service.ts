import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  similarProducts = new Subject<string>(); // Source
  similarProducts$ = this.similarProducts.asObservable(); // Stream
  constructor(
    private api: ApiService,
  ) { }
    
  getAllProductCategory = () => {
    return  this.api.get(`category/getAllProductCategory`).pipe(
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
  getAllProducts = () => {
    return  this.api.get(`home/getAllProducts`).pipe(
      map((res) => {
         return res.body;
      }),
      catchError((error) => {
        // TODO:: need to show errors
        // this.utility.showAlert(error.error.message, error.error.status , error.error.status);
        return of (false);
      })
  );
  } 
  getSimillarProducts = (productId) => {
    return  this.api.get(`/product/similarProduct/${productId}`).pipe(
      map((res) => {
        this.similarProducts.next(res.body);
         return res.body;
      }),
      catchError((error) => {
        // TODO:: need to show errors
        // this.utility.showAlert(error.error.message, error.error.status , error.error.status);
        return of (false);
      })
  );
  } 
  getDealOfTheDay = () => {
    return  this.api.get(`home/dealsOfTheDay`).pipe(
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
  
  getProductById = (productId) => {
    return  this.api.get(`product/ProductById/${productId}`).pipe(
      map((res) => {
         return res.body;
      }),
      catchError((error) => {
        // TODO:: need to show errors
        // this.utility.showAlert(error.error.message, error.error.status , error.error.status);
        return of (false);
      })
  );
  } 

  getOfferBanner = () => {
    return  this.api.get(`offer`).pipe(
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
  getProductBreadcrumb = (productId) => {
    return  this.api.get(`/product/productBreadCrum?productId=${productId}`).pipe(
      map((res) => {
        
         return res.body;
      }),
      catchError((error) => {
        // TODO:: need to show errors
        // this.utility.showAlert(error.error.message, error.error.status , error.error.status);
        return of (false);
      })
  );
  }

  getCategoryById = (catId) => {
    return  this.api.get(`category/getSubCategory/${catId}`).pipe(
      map((res) => {
         return res.body;
      }),
      catchError((error) => {
        // TODO:: need to show errors
        // this.utility.showAlert(error.error.message, error.error.status , error.error.status);
        return of (false);
      })
  );
  } 

  getOfferByCategory = (catId) => {
    return  this.api.get(`offer/offerByCategory/${catId}`).pipe(
      map((res) => {
         return res.body;
      }),
      catchError((error) => {
        // TODO:: need to show errors
        // this.utility.showAlert(error.error.message, error.error.status , error.error.status);
        return of (false);
      })
  );
  } 
  getAllOffers = () => {
    return  this.api.get(`offer`).pipe(
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
  getCategoryByCategoryName = (name) => {
    return  this.api.get(`category/getAllSubCategoryBycategoryName?name=${name}`).pipe(
      map((res) => {
         return res.body;
      }),
      catchError((error) => {
        // TODO:: need to show errors
        // this.utility.showAlert(error.error.message, error.error.status , error.error.status);
        return of (false);
      })
    );
  }
  getSearchResult = (searchText) => {
    return  this.api.get(`product/productSearch?name=${searchText}`).pipe(
      map((res) => {
         return res.body;
      }),
      catchError((error) => {
        // TODO:: need to show errors
        // this.utility.showAlert(error.error.message, error.error.status , error.error.status);
        return of (false);
      })
    );
  }
  
}
