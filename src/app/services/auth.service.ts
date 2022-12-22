import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { catchError, map } from 'rxjs/operators';
import jwt_decode from "jwt-decode";
import { UtilityService } from './utility.service';
import { Router } from '@angular/router';
import { CartService } from './cart.service';
import { CONSTANT } from '../constant';
import { environment } from 'src/environments/environment';
 @Injectable({
  providedIn: 'root'
})
export class AuthService {
  @ViewChild('snackbar') snackbar: ElementRef;
  public userSubject: BehaviorSubject<any>;
  public user: Observable<any>;
  public isCenterChange: BehaviorSubject<boolean>;
  token: unknown;
  baseUrl = CONSTANT.baseUrl;
  constructor(
    private apiService: ApiService,
    private utilityService: UtilityService,
    private router: Router,
    private cartService: CartService
  ) { 
    this.userSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
   }
  public login(data) {
    localStorage.setItem('previousPage', window.location.href);

    return this.apiService.postRaw(`user/signin`, data)
      .pipe(
        map((res: any) => {
          const deCodedToken: any = jwt_decode(res.body.token);
          //  TODO: need from backend
          deCodedToken.accessRole = 'user';
          //store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('user', JSON.stringify(deCodedToken));
          localStorage.setItem('token', res.body.token);
          this.userSubject.next(deCodedToken);
          if(deCodedToken.id){
            this.cartService.addItemIntoCartSS(deCodedToken.id, '', 'true', 'true').subscribe((res) => {
              if(res){
               console.log('cart...')                 
              }
            })
          }
          window.location.href = localStorage.getItem('previousPage');
          return deCodedToken;
        }),
        catchError(error => {
          this.utilityService.showSnackBar(error, error.status)
          return of(false);
        })
      );
      
  }

  public signUpForm = (data) => {
    localStorage.setItem('previousPage', window.location.href);
    return this.apiService.postRaw(`user/signUp`, data)
    .pipe(
      map((res: any) => {
        const deCodedToken: any = jwt_decode(res.body.token);
        //  TODO: need from backend
        deCodedToken.accessRole = 'user';
        //store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(deCodedToken));
        localStorage.setItem('token', res.body.token);
        this.userSubject.next(deCodedToken);
        if(deCodedToken.id){
          this.cartService.addItemIntoCartSS(deCodedToken.id, '', 'true', 'true').subscribe((res) => {
            if(res){
             console.log('cart...')                 
            }
          })
        }
        window.location.href = localStorage.getItem('previousPage');
        return deCodedToken;
      }),
      catchError(error => {
        this.utilityService.showSnackBar(error, error.status)
        return of(false);
      })
    );
    
  }
  public resetForm = (data) => {
    return this.apiService.postRaw(`user/reset`, data)
    .pipe(
      map((res: any) => {
        this.utilityService.showCartMessage(res.message, res.status);
        return res;
      }),
      catchError(error => {
        this.utilityService.showSnackBar(error, error.status)
        return of(false);
      })
    );
    
  }
  public logout() {

    // remove user from local storage to log user out
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.userSubject.next(null);
     if (environment.production) {
      window.location.href = this.baseUrl[1].dev;
    } else {
      window.location.href = this.baseUrl[0].local;
    }
  }

  public get userValue() {
    return this.userSubject.value;
  }
  public gmailLogin = (data) =>{
    localStorage.setItem('previousPage', window.location.href);
    return this.apiService.postRaw(`user/gmail/`, data)
    .pipe(
      map((res: any) => {
        const deCodedToken: any = jwt_decode(res.body.token);
        //  TODO: need from backend
        deCodedToken.accessRole = 'user';
        //store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(deCodedToken));
        localStorage.setItem('token', res.body.token);
         this.userSubject.next(deCodedToken);
        if(deCodedToken.id){
          this.cartService.addItemIntoCartSS(deCodedToken.id, '', 'true', 'true').subscribe((res) => {
            if(res){
             console.log('cart...')                 
            }
          })
        }
        window.location.href = localStorage.getItem('previousPage');
        return deCodedToken;
      }),
      catchError(error => {
        this.utilityService.showSnackBar(error, error.status)
        return of(false);
      })
    );
  }
  requestOtp = (data) => {
    return this.apiService.postRaw(`user/otpSend`, data)
    .pipe(
      map((res: any) => {
        this.utilityService.showCartMessage(res.message, res.status);
        return res;
      }),
      catchError(error => {
        this.utilityService.showSnackBar(error, error.status)
        return of(false);
      })
    );
  }
  verifyOtp = (data) => {
    localStorage.setItem('previousPage', window.location.href);
    return this.apiService.postRaw(`user/otpVerfiy`, data)
    .pipe(
      map((res: any) => {
        // this.utilityService.showCartMessage(res.message, res.status);
        const deCodedToken: any = jwt_decode(res.body.token);
        //  TODO: need from backend
        deCodedToken.accessRole = 'user';
        //store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(deCodedToken));
        localStorage.setItem('token', res.body.token);
        this.userSubject.next(deCodedToken);
        if(deCodedToken.id){
          this.cartService.addItemIntoCartSS(deCodedToken.id, '', 'true', 'true').subscribe((res) => {
            if(res){
             console.log('cart...')                 
            }
          })
        }
        window.location.href = localStorage.getItem('previousPage');
        return deCodedToken;
       }),
      catchError(error => {
         this.utilityService.showSnackBar(error, error.status)
        return of(false);
      })
    );
  }
  resendOtp = (data) => {
    return this.apiService.postRaw(`auth/resend`, data)
    .pipe(
      map((res: any) => {
        // this.utilityService.showSnackBar(res.message, 'customSuccess');
        return res;
      }),
      catchError(error => {
        this.utilityService.showSnackBar(error, error.status)
        return of(false);
      })
    );
  }
}
