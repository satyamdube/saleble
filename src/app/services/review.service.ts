import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ProductService } from './product.service';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(
    private api: ApiService,
    private productService: ProductService,
    private utilityService: UtilityService
  ) { }

  
  addReview = (data) => {
    return  this.api.postRaw(`reviews/addReviews`,data).pipe(
      map((res) => {
         return res.body;
      }),
      catchError((error) => {
        console.log(error);
        // TODO:: need to show errors
        this.utilityService.showSnackBar(error, error.status);
        return of (false);
      })
    );
  } 
  getReviewByProduct = (productId) => {
    return  this.api.get(`reviews/getReviewsByProductId/${productId}`).pipe(
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
  getProductRating = (productId) => {
    return  this.api.get(`reviews/getreviewsCountOfProduct/${productId}`).pipe(
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
  getMyReviews = () => {
    return  this.api.get(`/reviews/getReviewByUserId`).pipe(
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
