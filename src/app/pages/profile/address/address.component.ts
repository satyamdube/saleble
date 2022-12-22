import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  public  isModalOpen: boolean;
  public  addressFrom: FormGroup;
  public isLoading: boolean;
  public addressListing: any;
  public addressId: string;
  constructor(
      private userService: UserService,
      private fb: FormBuilder
  ) {
    this.userService.addressForm.subscribe((res) => {
      if(!res){
        this.isModalOpen = false;
        this.getUserAddress();
      }
    })
   }

  ngOnInit(): void {
    this.getUserAddress();
  }

  getUserAddress = () => {
    this.userService.getUserAddress().subscribe((res) => {
        if(res){
          this.addressListing = res;
          console.log(res)
        }
    })
  }
 
  edit = (addressData) =>{
    // this.addressId = addressData._id;
    // this.addressFrom.patchValue(addressData);
    this.isModalOpen = true;
    this.userService.onPassAddressFormValue(addressData);
  }

  delete = (addressId) => {
    const data = {
      address_id: addressId,
    }
    this.userService.deleteUserAddress(data).subscribe((res) => {
      this.getUserAddress();
    })
  }
}
