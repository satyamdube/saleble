import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { HomeService } from 'src/app/services/home.service';
import { ProductService } from 'src/app/services/product.service';
import { SocialAuthService, GoogleLoginProvider, SocialUser, SocialLoginModule, FacebookLoginProvider } from 'angularx-social-login';
import { UtilityService } from 'src/app/services/utility.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [SocialAuthService, AuthService]

})
export class HeaderComponent implements OnInit {
  categoryList: any;
  public showAllCategories: boolean = false;
  openMobileMenu: boolean = false;
  public subCategroy = 'electronics'
  isUserLoggedIn: boolean;
  loggedInUserData: any;
  brandDetail: any;
  cartItemsCount: number = 0;
  FeaturedCategory: any;
  isLoading: boolean;
  forgetPassword: boolean
  loginType: string;
  otpVerifyForm: FormGroup;
  public searchData: string;
  searchResult: any;
  showPasswordExamples: boolean;
  showOtpModal: boolean;
  isOtpVerifying: boolean;
  isRequestingOtp: boolean;
  query = window.matchMedia("(max-width: 800px)");
  disbaleMobileLink: boolean;
  showContinueButton: boolean;
  isLoginWithEmail: boolean;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private utilityService: UtilityService,
    private cartService: CartService,
    private homeService: HomeService,
    private productService: ProductService,
    private api: ApiService,
    private socialAuthService: SocialAuthService,
    private router: Router
   ) {
    this.auth.user.subscribe((user) => {
      this.isUserLoggedIn = !!user
    })
   
    this.cartService.showLoginModal.subscribe((res: any) => {
          if(res){
              this.isLoginModal = true;
          }
    });
    this.cartService.productsInCart.subscribe((res) => {
      if(res){
         this.getCartCounts();
      }
    });
    this.doCheck(this.query) // Call listener function at run time
    this.query.addListener(this.doCheck) // Attach listener function on state changes
   }
   hiderSearchResult: boolean;
  isLoginModal: boolean;
  isSignUpModal: boolean;
  toggleInput: boolean;
  loginForm: FormGroup;
  signUpForm: FormGroup;
  forgetPasswordForm: FormGroup;
  public mainMenuArray = ['Electronics','Men','Women','home','baby & toys','fragrances','sports','appliances','mobile']


  ngOnInit(): void {
     this.loginFormInit();
     this.signUpFormInit();
     this.forgetPasswordFormInit();
     if(this.isUserLoggedIn) {
        this.getLoggedInUserData();
    }
    this.otpVerifyFormInit();
    this.getAllProductCategory();
  
  }
  public showCategoryMenu = (menuIndex) => {
    this.subCategroy = menuIndex
  }
  getCartCounts = () => {
     this.cartService.getItemFromCart(this.loggedInUserData ? this.loggedInUserData._id : 'null').subscribe((res) => {
      if(res){
        this.cartItemsCount = res.items.length
       }
    })
  }
  public convertToSmallCase = (menuType) => menuType.trim().toLowerCase();
  openProfile = () => {
    this.isLoginModal = true;
  }
  otpVerifyFormInit = () => {
    this.otpVerifyForm = this.fb.group({
      f_phone: ['', Validators.required],
      otp: ['', Validators.required]
    })
  }
  resetModal = () => {
    this.isLoginModal = false;
    this.isSignUpModal  = false;
    this.forgetPassword = false;
    this.isLoading = false;
    this.forgetPasswordFormInit();
    this.cartService.showLoginModal.next(false)
  }
  loginFormInit(){
    this.loginForm = this.fb.group({
      f_email: ['', Validators.required],
      f_password: ['', Validators.required]
    })
  }
  signUpFormInit(){
    this.signUpForm = this.fb.group({
      f_name: ['', Validators.required],
      l_name: ['', Validators.required],      
      f_email: ['', Validators.required],
      f_password: ['', Validators.required],
    })
  }
  forgetPasswordFormInit(){
    this.forgetPasswordForm = this.fb.group({
      email: ['', Validators.required],
    })
  }
  login = () => {
    this.isLoading = true;
      this.auth.login(this.loginForm.value).subscribe((res) => {
       if(res){
        this.resetModal();
      }
      this.isLoading = false;
    })
  }
  onForgetPassword = () => {
    this.isLoading = true;
    this.auth.resetForm(this.forgetPasswordForm.value).subscribe((res) => {
     if(res){
      this.resetModal();
    }
    this.isLoading = false;
  })
  }
  createAccount = () =>{
    this.isLoading = true;
      if( this.utilityService.checkStrength(this.signUpForm.controls.f_password.value) !== 40){
      this.isLoading = false;
      this.showPasswordExamples = true;
      return;
     } else {
      this.showPasswordExamples = false;
     }
      this.auth.signUpForm(this.signUpForm.value).subscribe((res) => {
      if(res){
        this.resetModal();
      }
      this.isLoading = false;
    })
  }
  toggleInputField = () => {
    this.toggleInput = !this.toggleInput
   }
  getLoggedInUserData = () => {
     this.api.get('/user/me').subscribe((res) => {
       this.loggedInUserData = res.body;
       this.getCartCounts();
     })
  } 
  logOut(){
    this.auth.logout();
    this.cartService.productsInCart.next(true);
    this.loggedInUserData = [];
  }
  getAllProductCategory = () => {
    this.homeService.getAllProductCategory().subscribe((res) => {      
        let tmpData = res.filter( ele =>  ele.status === true);
        console.log(tmpData);
        this.categoryList = tmpData.sort((a, b) => a.position > b.position ? 1 : -1);;

     })
  }
  getAllBrandByCategory = (catId) => {
    if(catId){
      this.productService.getAllBrandByCategory(catId).subscribe((res) => {
        this.brandDetail = res.brandRecord;
        this.FeaturedCategory = res.featuredCategoryRecord[0];
      })
    } 
  }
  loginWithGoogle = () => {
    this.loginType = 'gmail'
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
    .then(d => console.log(d))
    .catch(error => {
      this.loginType = ''
    });;
    this.socialAuthService.authState.subscribe((user) => {
      // console.log(user)
       this.auth.gmailLogin(user).subscribe((res) => {
        // 
      })
      this.loginType = ''
    });
  }
  loginWithFb = () => {
    this.loginType = 'fb'
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID)
    .then(d => console.log(d))
    .catch(error => {
      this.loginType = ''
    });;
    this.socialAuthService.authState.subscribe((user) => {
       //  this.auth.gmailLogin(user).subscribe((res) => {
      //   
      // })
      this.loginType = ''
    });
  }
  searchProduct = (event) => {
    // console.log(`searchData=>${this.searchData}`)
    if(this.searchData.split('').length >= 3){
      this.hiderSearchResult = true;
      this.homeService.getSearchResult(this.searchData).subscribe((res) => {
         if(typeof res === 'object'){
          this.searchResult = res;
        } else{
           this.searchResult = [];
        }
      })
    } else{
      this.searchResult = [];
    }
     // if(event.keyCode == 13){
    //   alert('Entered Click Event!');
    // }else{
    // }
  }
  requestOtp = () => {
    this.isRequestingOtp = true
    const errorData = {
      error: {
        message: 'Please Enter Phone Number'
      }
    }
    if(this.loginForm.controls.f_email.invalid){
      this.utilityService.showSnackBar(errorData,'customError');
      return;
    }
    const data = {
      f_phone: (this.loginForm.controls.f_email.value * 1),
    }
    this.auth.requestOtp(data).subscribe((res) => {
      this.showOtpModal = true;

      if(res){
        this.showOtpModal = true;
      }
      this.isRequestingOtp = false
    })
  }
  resetOtpModal = () => {
    this.showOtpModal = false;
  }
  verifyOtp = () => {
    this.isOtpVerifying = true;
    this.otpVerifyForm.controls.f_phone.patchValue(this.loginForm.controls.f_email.value);
    // console.log(this.otpVerifyForm.value);
    const data = {
      f_phone: this.otpVerifyForm.controls.f_phone.value, 
      otp: (this.otpVerifyForm.controls.otp.value * 1),
    }
    this.auth.verifyOtp(data).subscribe((res) => {
       this.isOtpVerifying = false;        
      this.otpVerifyForm.controls.otp.patchValue(null);
    })
  }
  doCheck(query) {
    if (query.matches) { // If media query matches
        this.disbaleMobileLink = true;
    } else {
      this.disbaleMobileLink = false;

    }
  }
  
  sellWithUs = () => {
    window.open('https://seller.saleable.in/', "_blank");
  }
  searchByEnter = () => {
     this.router.navigateByUrl(`search-result/${this.searchData}`);
     this.searchResult = null;
  }
  @HostListener('document:click', ['$event']) onDocumentClick(event) {
    this.searchResult = false;
  }
  onEnterEmail = () => {
    console.log()
    if(this.loginForm.value.f_email.length >= 1){
      this.showContinueButton = true;
    } else {
      this.showContinueButton = false;
    }
  }
  onContinue = () => {
    this.requestOtp();
  }
  onLoginWithEmail = () => {
    this.isLoginWithEmail = true;
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // if (document.body.scrollTop > 20 ||     
    // document.documentElement.scrollTop > 30) {
    //   document.getElementById('secondary_header').classList.add('hide');
    // } else{
    //   document.getElementById('secondary_header').classList.remove('hide');
    // }
  }
  resendOtp = () => {
    const data = {
     f_phone: this.loginForm.controls.f_email.value, 
    }
   this.auth.resendOtp(data).subscribe((res) => {
     
   })
 }
}
