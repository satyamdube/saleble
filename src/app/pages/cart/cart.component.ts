import {Component, OnInit, HostListener} from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {environment} from "../../../environments/environment";
import {ApiService} from "../../services/api.service";
import { UtilityService } from 'src/app/services/utility.service';
import { Router } from '@angular/router';
import { CONSTANT } from 'src/app/constant';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  productsInCartListings: any;
  productQuantity: number = 1;
  isUserLoggedIn: boolean;
  changeAddressModal: boolean;
  isProceedToCheckout: boolean;
  defaultAddress: any;
  loggedInUserData: any;
  addressListings: any;
  initiateRazorPay: any;
  showEditModal: boolean;
  baseUrl = CONSTANT.baseUrl;
  isModalOpen: boolean;
  tmpAttributeArray:any = {};
  rzpKey = environment.rzpTestKey
  cartDataMrp = {
    totalMrp: 0,
    discountedMrp: 0,
    conveinceFee: 50,
    couponDiscount: 0,
    totalAmount: 0,
  }
  cartUpdatingOptions: any  = {
    cartItemId: '',
    productId: '',
    guestCartId: '',
    selectedAttributes: [],
    productQuantity: 0,
  }
   rzpOptions =  {
    key: "YOUR_KEY_ID", // Enter the Key ID generated from the Dashboard
    amount: "0000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    name: "saleable",
    order_id: '',
    image: "https://saleable-docs.s3.ap-south-1.amazonaws.com/others/loader.gif",
    "callback_url": "https://eneqd3r9zrjok.x.pipedream.net/",
    // "handler": (res, data) :any => {
    //   console.log(res)
    // },
    "handler": function (response){
      var event = new CustomEvent("payment.success",
          {
            detail: response,
            bubbles: true,
            cancelable: true
          }
      );
      window.dispatchEvent(event);
    },
    "prefill": {
      "name": "",
      "email": "",
      "contact": ""
    },
    "notes": {
      "address": ""
    },
    "options":{
      "checkout":{
        "method":{
          "netbanking":1,
          "card":1,
          "upi":0,
          "wallet":0
        }
      }
    },
    "theme": {
      "color": "#3399cc"
    }
  };
  selectedQuantity: number;
  attributeData: any;
  productStockQuantityFromServer: any;
  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private userService: UserService,
    private utilityService: UtilityService,
    private  api: ApiService,
    private router: Router,
  ) {
    this.productsInCartListings = [];
    this.authService.user.subscribe((user) => {
      this.isUserLoggedIn = !!user;
      if(this.isUserLoggedIn){
        this.getAllAddress();
        this.getLoggedInUserData();
        this.userService.addressForm.subscribe((res) => {
          if(!res){
            this.isModalOpen = false;
            this.getAllAddress();
          }
        });
      }  else {
        this.getCartDetailFromServer();
      }
    });
   
  }
 

  ngOnInit(): void {
  }
  getCartDetailFromServer = () => {
    this.utilityService.showPreloader(); 
     this.cartService.getItemFromCart(this.loggedInUserData ? this.loggedInUserData._id : 'null').subscribe((res) => {
      const tmpCartArray = []
      this.utilityService.hidePreloader();
       this.cartUpdatingOptions.guestCartId = this.loggedInUserData ? null : res._id;
       if(res){
         console.log(res)
        res.items.forEach(element => {
            element.productId.productQuantity = element.productQuantity;
            element.productId.selectedAttributes = element.selectedAttributes;
            element.productId.cartItemId = element._id
            tmpCartArray.push(element.productId)
        });
        this.productsInCartListings = [...tmpCartArray];         
        Object.assign(this.cartDataMrp, res.cartDataMrp);
         this.cartService.productsInCart.next(this.productsInCartListings.length);
      }
    })
  }
  removeItemFromCart = (cartData) => {
    // console.log(cartData)
    const data = {
      cartItemId: cartData.cartItemId,
      productId: cartData._id,
      productQuantity: cartData.productQuantity
    }
    this.cartService.deleteItemFromCartSS(this.loggedInUserData ? this.loggedInUserData._id : 'null', data).subscribe((res) => {
       if(res){
        this.getCartDetailFromServer();
      }
    })
  }

 

  setCartAttributes = (data) => {
    let text;
    for (const key in data) {
      text = `<span>${key}:</span> ${data[key]} <i class="feather-chevron-down"></i>`
    }
    return text;
  }

  getAllAddress = () => {
    this.userService.getUserAddress().subscribe((res) => {
      if(res){
        this.defaultAddress = res.filter((ele) => ele.defaultAddress === true)[0]
        res.forEach((ele) => {
          if(ele.defaultAddress){
            ele.isChecked = true;
          } else {
            ele.isChecked = false;
          }
        })

        this.addressListings = res;
       }
    })
  }


  proceedToCheckout = () => {
    if(!this.isUserLoggedIn){
        this.cartService.showLoginModal.next(true)
    } else {
     if(!this.defaultAddress){
      this.isModalOpen  = true;
     }else{
      this.changeAddressModal = true;
      this.isProceedToCheckout = true;
     }
    }
  }

  onSelectAddress = (addressData) => {
   this.defaultAddress = addressData;
   if(!this.isProceedToCheckout){
     this.changeAddressModal = false;
   }
   this.addressListings.map((ele) => {
      if(ele._id === addressData._id){
        ele.isChecked = true;
      }else {
        ele.isChecked = false;
      }
   })
  }
  getLoggedInUserData = () => {
    this.api.get('/user/me').subscribe((res) => {
      this.loggedInUserData = res.body;
      this.getCartDetailFromServer();
    })
  }
  payNow = () => {
    this.utilityService.showPreloader();
    const data = {
      "amount": this.cartDataMrp.totalAmount,
    }
    this.cartService.genrateOrderUsingRzp(data).subscribe((res) =>{
     if(res){
      this.changeAddressModal = false;
      this.rzpOptions.key = this.rzpKey
      this.rzpOptions.amount = res.amount;
      this.rzpOptions.prefill.name = this.loggedInUserData.f_name;
      this.rzpOptions.prefill.email = this.loggedInUserData.f_email;
      this.rzpOptions.prefill.contact = this.loggedInUserData.f_phone;
      this.rzpOptions.order_id = res.id;
      this.initiateRazorPay  = new this.cartService.nativeWindow.Razorpay(this.rzpOptions);
      this.initiateRazorPay.open();
      this.initiateRazorPay.on('payment.failed', function (response){
        console.log(response.error.code);
        console.log(response.error.description);
        console.log(response.error.source);
        console.log(response.error.step);
        console.log(response.error.reason);
        console.log(response.error.metadata.order_id);
        console.log(response.error.metadata.payment_id);
        this.error = response.error.reason;
      });
     };
     this.utilityService.hidePreloader();
    })
    
  }
  @HostListener('window:payment.success', ['$event'])
  onPaymentSuccess(event): void {
     this.cartService.getRzpPaymentDetail(event.detail.razorpay_order_id).subscribe((res)=> {
      this.utilityService.hidePreloader();
      if(res){
        this.genrateOrder(res.items[0]);
      }
    })
  }
  cashOnDelivery = () => {
    const data = {
      method: 'cod',
      id: null
    }
    this.genrateOrder(data);
  }
  genrateOrder = (res) => {
    this.utilityService.showPreloader();
     let data  = {
      payment: {
        paymentMethod: '',
        paymentId: '',
      }
    }; 
    data['address'] = this.defaultAddress;
    data['totalAmount'] = this.cartDataMrp.totalAmount;
    data['orders'] = this.productsInCartListings;
    data['payment'].paymentMethod = res.method;
    data['payment'].paymentId = res.id;
    // console.log(data);
    // return;
    this.cartService.genrateOrder(data).subscribe((res) => {
      
      if(res){
        console.log(res)
        // localStorage.setItem('ddede', JSON.stringify(res))
        this.cartService.clearCart().subscribe((response) => {
        });
          if (environment.production) {
          window.location.href = `${this.baseUrl[1].dev}/my/orders`;
        } else {
          window.location.href = `${this.baseUrl[0].local}/my/orders`;
        }
        this.utilityService.hidePreloader();
      }
    })
  }
  updatedAttributes = (attributedData, attributeType) => {
    this.attributeData = attributedData;
     this.showEditModal = true;
     this.cartUpdatingOptions.selectedAttributes  = attributedData.selectedAttributes;
    this.productStockQuantityFromServer = attributedData.productStockQuantity >= 10 ? 10 : attributedData.productStockQuantity ;
    this.cartUpdatingOptions.productQuantity = this.attributeData.productQuantity;
    this.selectedQuantity = this.attributeData.productQuantity;
    this.cartUpdatingOptions.cartItemId = attributedData.cartItemId;
    this.cartUpdatingOptions.productId = attributedData._id;
  }
  onChangeAttribute = (selectedValue, attribute) => {
    const tmpAttribute = {}
       if(attribute === 'qty'){
        this.cartUpdatingOptions.productQuantity = selectedValue;
      }else {
        let targetElement;
         // this.cartUpdatingOptions.selectedAttributes = [];
        targetElement =   this.cartUpdatingOptions.selectedAttributes.filter((item) => Object.keys(item)[0] !== attribute);
        this.cartUpdatingOptions.selectedAttributes = [...targetElement];
        tmpAttribute[attribute] = selectedValue
        this.cartUpdatingOptions.selectedAttributes.push(tmpAttribute);
        if(this.cartUpdatingOptions.selectedAttributes.length === 1){
          this.cartUpdatingOptions.selectedAttributes.filter((item) => {
            console.log(this.cartUpdatingOptions.selectedAttributes )
            console.log(Object.keys(item)[0] , attribute)
          });
          console.log(attribute)
          console.log(targetElement)
          console.log(this.cartUpdatingOptions.selectedAttributes);
          return;
        } else {
          console.log(this.cartUpdatingOptions.selectedAttributes);
        }
      }
  }
  isAttrbiuteSelected = (selectedData) => {
     if(selectedData.includes('-selected')){
      return true;
    }
  }
  alterSelectedText = (selectedData) => {
    return selectedData.split('-')[0]
  }
  onUpdateCart = () => {
    // if(this.cartUpdatingOptions.selectedAttributes.length === 1){
    //   return;
    // }
    this.cartService.updateCart(this.loggedInUserData ? this.loggedInUserData._id : null,this.cartUpdatingOptions).subscribe((res) => {
      this.showEditModal = false;
      if (environment.production) {
        window.location.href = `${this.baseUrl[1].dev}/cart`;
      } else {
        window.location.href = `${this.baseUrl[0].local}/cart`;
      }
     })
  }
}
