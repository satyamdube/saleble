import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent implements OnInit {
  public  isModalOpen: boolean;
  public  addressFrom: FormGroup;
  public isLoading: boolean;
  public addressListing: any;
  public addressId: string;
  constructor(
    private userService: UserService,
    private fb: FormBuilder
) {
  this.addressFormInit();
  this.userService.addressForm.subscribe((res) => {
    if(res){
      this.addressId = res._id;
      this.addressFrom.patchValue(res);
    }
  })
 }


  ngOnInit(): void {
  }

  addressFormInit = () => {
    this.addressFrom = this.fb.group({
      name: ['', Validators.required],
      pincode: ['', Validators.required],
      mobile: ['', Validators.required],
      location: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      landmark: ['', Validators.required],
      state: ['', Validators.required],
      defaultAddress: [false, Validators.required],
      AlternativePhone: [''],
      f_email: [''],
      addressType: ['home', Validators.required]
    })
  }
  onSubmit = () => {
    this.isLoading = true;
    if(this.addressId){
      this.userService.udpateUserAddress(this.addressFrom.value, this.addressId).subscribe((res) => {
        if(res){
          this.resetForm();
        }
        this.isLoading = false
      })
    } else {
      this.userService.saveUserAddress(this.addressFrom.value).subscribe((res) => {
        if(res){
          this.resetForm();
        }
        this.isLoading = false
      })
    }

  }
  resetForm = () => {
    this.addressFormInit();
    this.isModalOpen = false;
    this.userService.onResetAddress();
  }
  getlocationByPincode = (pincode) => {
    console.log(pincode.length);
    if(pincode.length >= 6){
      this.userService.getlocationByPincode(pincode).subscribe((res) => {
        if(res){
          this.addressFrom.patchValue({
            city:  res.Name,
            state: res.State, 
          })
        }
        
      })
    }
 
  }
}
