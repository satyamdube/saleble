import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CONSTANT } from '../constant';
import { UtilityService } from './utility.service';
import {ApiService} from "./api.service";
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
function _window():any {
    return window;
}
@Injectable({
  providedIn: 'root'
})

export class CartService {
  rzpOrderRoute = 'https://api.razorpay.com/v1/orders';
  cartItems: any[];
    get nativeWindow(): any {
        return _window();
    }
  public productsInCart = new Subject<boolean>();
  public  showLoginModal = new Subject<boolean>();
  public cartMessage = CONSTANT.cartMessage
  constructor(
    private utilityService: UtilityService,
    private api: ApiService,
    private router: Router
  ) {
    this.cartItems = [];
  }

  addItemIntoCart = (productData: any, productAttributes, productQuantity, isLoggedIn: string, loggedInUserDetail) => {
    this.utilityService.showPreloader();
    if (this.isAttributeEmpty(productAttributes)) {
      this.utilityService.hidePreloader();
      return;
    }
    const tmpArray = [];
    for (const key in productAttributes) {
      tmpArray.push({ [key]: productAttributes[key] })
    }
    productData.selectedAttributes = [...tmpArray];
    productData.productQuantity = (productQuantity * 1)
    const cartItem = [];
    const cartAfterLogin = {
      selectedAttributes:{},
      productId: "",
      productQuantity: 0,
    }
    cartAfterLogin.productId = productData._id;
    cartAfterLogin.productQuantity = productData.productQuantity;
    cartAfterLogin.selectedAttributes = productData.selectedAttributes
    cartItem.push(cartAfterLogin)
    this.addItemIntoCartSS( loggedInUserDetail ? loggedInUserDetail._id: 'null',cartItem,isLoggedIn, 'false').subscribe((res) => {
      if(res){
        this.productsInCart.next(true);
      }
      this.utilityService.hidePreloader();
    });

   }
 
  isAttributeEmpty = (obj) => {
    const errorMessage = {
      error: {}
    }
    for (const key in obj) {
      if (!obj[key]) {
        errorMessage.error['message'] = `Please Select ${key}`;
        this.utilityService.showSnackBar(errorMessage, 'customError');
        return true;
      }
    }
  }

  // Adding item into cart after login

    addItemIntoCartSS = (userId=null,data,flag, isDuringLogin) => {
      console.log(data);
      
        return  this.api.postRaw(`cart/addProductToCart?userId=${userId}&isLogged=${flag}&duringLogin=${isDuringLogin}`, data).pipe(
            map((res) => {
              // if(!isDuringLogin){
              // }
              // this.utilityService.showCartMessage(this.cartMessage[0].msg, 'Success');
              // console.log(res)
              return res.body;
            }),
            catchError((error) => {
                // this.utitlityService.showSnackBar(error, error.status)
                return of (false);
            })
        );
    }

    getItemFromCart= (userId) => {
        return  this.api.get(`cart/getCartByUserId?userId=${userId ? userId : 'null'}`).pipe(
            map((res) => {
                // this.utitlityService.showSnackBar(res, res.status)
                return res.body;
            }),
            catchError((error) => {
                // this.utitlityService.showSnackBar(error, error.status)
                return of (false);
            })
        );
    }
    deleteItemFromCartSS = (userId=null,data) => {
        return  this.api.deleteAll(`cart/deleteProductByUserId?userId=${userId}`, data).pipe(
            map((res) => {
              // this.utilityService.showCartMessage(res.message, 'Success');
              this.productsInCart.next(true);
               return res.body;
            }),
            catchError((error) => {
                // this.utitlityService.showSnackBar(error, error.status)
                return of (false);
            })
        );
    }
    genrateOrderUsingRzp = (data) => {
      return  this.api.postRaw(`payment/rzrPay`, data).pipe(
        map((res) => {
          // this.utilityService.showCartMessage(res.message, 'Success');
          this.productsInCart.next(true);
           return res.body;
        }),
        catchError((error) => {
            // this.utitlityService.showSnackBar(error, error.status)
            return of (false);
        })
    );
    }
    getRzpPaymentDetail = (data) => {
        return  this.api.get(`payment/rzrPay/${data}`).pipe(
          map((res) => {
            // this.utilityService.showCartMessage(res.message, 'Success');
            this.productsInCart.next(true);
            return res.body;
          }),
          catchError((error) => {
              // this.utitlityService.showSnackBar(error, error.status)
              return of (false);
          })
      );
    }
    genrateOrder = (data) => {
      return  this.api.postRaw(`order`, data).pipe(
        map((res) => {
          // this.utilityService.showCartMessage(res.message, 'Success');
          this.productsInCart.next(true);
           return res.body;
        }),
        catchError((error) => {
            // this.utitlityService.showSnackBar(error, error.status)
            return of (false);
        })
    );
    }
    getOrder = (filterData) => {
      return  this.api.get(`order?filter=${filterData}`).pipe(
        map((res) => {
          // this.utilityService.showCartMessage(res.message, 'Success');
          this.productsInCart.next(true);
          return res.body;
        }),
        catchError((error) => {
            // this.utitlityService.showSnackBar(error, error.status)
            return of (false);
        })
      );
    }
    clearCart = () => {
      return  this.api.delete(`cart/deleteCartDataByUserId`).pipe(
        map((res) => {
          // this.utilityService.showCartMessage(res.message, 'Success');
          this.productsInCart.next(true);
          return res.body;
        }),
        catchError((error) => {
            // this.utitlityService.showSnackBar(error, error.status)
            return of (false);
        })
      );
    }
    updateCart = (userId, data) => {
       return  this.api.put(`cart/updateCartByUserId?userId=${userId}`, data).pipe(
        map((res) => {
          // this.utilityService.showCartMessage(res.message, 'Success');
          this.productsInCart.next(true);
          return res.body;
        }),
        catchError((error) => {
            // this.utitlityService.showSnackBar(error, error.status)
            return of (false);
        })
      );
    }
    cancelOrder = (data) => {
      return  this.api.postRaw(`payment/cancelOrder`, data).pipe(
        map((res) => {
          this.utilityService.showCartMessage(res.message, 'Success');
          this.productsInCart.next(true);
          return res.body;
        }),
        catchError((error) => {
            this.utilityService.showSnackBar(error, error.status)
            return of (false);
        })
      );
    }
}
