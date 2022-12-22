import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {UtilityService} from "./utility.service";
@Injectable({
  providedIn: 'root'
})
export class UserService {
  public loggedInUserData: BehaviorSubject<any>;
  public addressForm: BehaviorSubject<any>;

  constructor(
    private api: ApiService,
    private utitlityService: UtilityService
  ) { 
    this.loggedInUserData = new BehaviorSubject('');
    this.addressForm = new BehaviorSubject('');
    this.getLoggedInUserData();
  }

  getLoggedInUserData = () => {
    // this.api.get('/user/me').subscribe((res) => {
    //   this.loggedInUserData.next(res.body);
    // })
  }

  public get userValue  () {
     return this.loggedInUserData.value
  }

  public get addressFormValue  () {
    return this.addressForm.value
  }
  
  updateUserProfile = (data) => {
    return  this.api.postRaw(`user/updateUser`,data).pipe(
        map((res) => {
          this.utitlityService.showSnackBar(res.message, 'customSuccess')
          return res.body;
        }),
        catchError((error) => {
          return of (false);
        })
    );
  }
  updateUserPassword = (data) => {
    return  this.api.postRaw(`user/changePassword`,data).pipe(
        map((res) => {
          this.utitlityService.showSnackBar(res.message, 'customSuccess')
          return res.body;
        }),
        catchError((error) => {
          this.utitlityService.showSnackBar(error, error.status)
          return of (false);
        })
    );
  }
  saveUserAddress = (data) => {
    return  this.api.postRaw(`user/addNewAddress`, data).pipe(
        map((res) => {
            this.utitlityService.showSnackBar(res, res.status)
            return res.body;
        }),
        catchError((error) => {
            this.utitlityService.showSnackBar(error, error.status)
            return of (false);
        })
    );
  }
    udpateUserAddress = (data,addressId) => {
        return  this.api.put(`user/updateAddress/${addressId}`, data).pipe(
            map((res) => {
                this.utitlityService.showSnackBar(res, res.status)
                return res.body;
            }),
            catchError((error) => {
                this.utitlityService.showSnackBar(error, error.status)
                return of (false);
            })
        );
    }
  getUserAddress = () => {
    return  this.api.get(`user/address`).pipe(
        map((res) => {
          return res.body;
        }),
        catchError((error) => {
          return of (false);
        })
    );
  }
    deleteUserAddress = (data) => {
        return  this.api.postRaw(`user/deleteMyAddress`, data).pipe(
            map((res) => {
                this.utitlityService.showSnackBar(res, res.status)
                return res.body;
            }),
            catchError((error) => {
                this.utitlityService.showSnackBar(error, error.status)
                return of (false);
            })
        );
    }
    getlocationByPincode = (pincode) => {
      this.utitlityService.showPreloader();
      return  this.api.getThirdParty(`https://api.postalpincode.in/pincode/${pincode}`).pipe(
        map((res) => {
          console.log(JSON.parse(res)[0].PostOffice[0]);
          this.utitlityService.hidePreloader();
            // this.utitlityService.showSnackBar(res, res.status);            
            return JSON.parse(res)[0].PostOffice[0];
        }),
        catchError((error) => {
          this.utitlityService.hidePreloader();
            // this.utitlityService.showSnackBar(error, error.status)
            return of (false);
        })
    );
      
    }
    onResetAddress = () => {
      this.addressForm.next(false)
    }
    onPassAddressFormValue = (data) => {
      this.addressForm.next(data);
    }
}
