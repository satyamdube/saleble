import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../../services/user.service";
@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss']
})
export class ProfileDetailComponent implements OnInit {
  private loggedInUserData: any;
  public profileForm: FormGroup;
  public isLoading: boolean;
  public passwordUpdateForm: FormGroup;
  hideOldPassword: boolean;
  constructor(
      private api: ApiService,
      private fb: FormBuilder,
      private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getLoggedInUserData();
    this.profileFormInit();
    this.passwordUpdateFormInit();
  }
  profileFormInit = () => {
    this.profileForm = this.fb.group({
      f_name: ['', Validators.required],
      l_name: ['', Validators.required],
      f_email: ['', Validators.required],
      f_phone: ['', Validators.required]
    })
  }

  passwordUpdateFormInit = () => {
      this.passwordUpdateForm = this.fb.group({
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        // oldPassword: [''],
      })
  }
  getLoggedInUserData = () => {
    this.api.get('/user/me').subscribe((res) => {
      console.log('in')
      this.loggedInUserData = res.body;
       this.profileForm.patchValue(this.loggedInUserData);
      //  if(this.loggedInUserData.signupType){
      //   this.passwordUpdateForm.controls['oldPassword'].clearValidators();
      //   this.passwordUpdateForm.controls["oldPassword"].updateValueAndValidity();      
      //   this.hideOldPassword = true;
         
      //   } else {                
      //     this.passwordUpdateForm.controls['oldPassword'].setValidators(Validators.required);      
      //     this.passwordUpdateForm.controls["oldPassword"].updateValueAndValidity();
      //     this.hideOldPassword = false;
      //   }
        console.log(this.passwordUpdateForm.controls)
     })
  }

  onSubmit = () => {
      this.isLoading = true;
      this.userService.updateUserProfile(this.profileForm.value).subscribe((res) => {
           this.isLoading = false;
      })
  }
  onUpdatePassword = () => {
    this.isLoading = true;
    this.userService.updateUserPassword(this.passwordUpdateForm.value).subscribe((res) => {
         this.isLoading = false;
         this.passwordUpdateFormInit();
    })
}

}
