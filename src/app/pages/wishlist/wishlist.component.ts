import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  isUserLoggedIn: boolean;
  wishListProduct: any;
  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private productService: ProductService,
    private utitlityService: UtilityService
  ) { 
    this.authService.userSubject.subscribe((user) => {
      this.isUserLoggedIn = !!user;
      if(this.isUserLoggedIn){
        this.getWishlistedItem();
      }
    });
  }

  ngOnInit(): void {
  }
  proceedToCheckout = () => {
    if(!this.isUserLoggedIn){
        this.cartService.showLoginModal.next(true)
    } else {
    }
  }
  getWishlistedItem = () => {
    this.utitlityService.showPreloader();
    this.productService.getWishlistItem().subscribe((res) => {
      if(res){
        this.wishListProduct = res;
      }
      this.utitlityService.hidePreloader();
    })
  }
  deleteWishlistItem = (wishlistId) => {
    this.utitlityService.showPreloader();
     const data = {
      id:wishlistId
    }
    this.productService.deleteWishlistItem(data).subscribe((res) => {
      this.getWishlistedItem();
      this.utitlityService.hidePreloader();
    })
  }
}
