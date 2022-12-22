import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShopByCategoryComponent } from './shop-by-category/shop-by-category.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ImgMagnifier } from "ng-img-magnifier";
import { RouterModule } from '@angular/router';
import { ProductsListingComponent } from './products-listing/products-listing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileDashboardComponent } from './profile/profile-dashboard/profile-dashboard.component';
import { ProfileDetailComponent } from './profile/profile-detail/profile-detail.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { AddressComponent } from './profile/address/address.component';
import { NavigationsComponent } from './profile/navigations/navigations.component';
import { OffersListingComponent } from './offers-listing/offers-listing.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { OrdersComponent } from './profile/orders/orders.component';
import { CategoryComponent } from './category/category.component';
import { CartComponent } from './cart/cart.component';
import { ReviewComponent } from './review/review.component';
import { ReceintViewProductsComponent } from './receint-view-products/receint-view-products.component';
import { CancelOrderComponent } from './profile/cancel-order/cancel-order.component';
import { SearchResultComponent } from './search/search-result/search-result.component';
import { MyReviewComponent } from './profile/my-review/my-review.component';
import { SimilarProductsComponent } from './similar-products/similar-products.component';
import { ReturnPolicyComponent } from './return-policy/return-policy.component';
import { TermOfSaleComponent } from './term-of-sale/term-of-sale.component';
import { TermOfUseComponent } from './term-of-use/term-of-use.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { AddAddressComponent } from './profile/add-address/add-address.component';
import { VendorCompleteProdcutsComponent } from './vendor-complete-prodcuts/vendor-complete-prodcuts.component'
 

@NgModule({
  declarations: [HomeComponent, ShopByCategoryComponent, ProductDetailComponent, ProductsListingComponent, ProfileDashboardComponent, ProfileDetailComponent, AddressComponent, NavigationsComponent, OffersListingComponent, WishlistComponent, OrdersComponent, CategoryComponent, CartComponent, ReviewComponent, ReceintViewProductsComponent, CancelOrderComponent, SearchResultComponent, MyReviewComponent, SimilarProductsComponent, ReturnPolicyComponent, TermOfSaleComponent, TermOfUseComponent, PrivacyPolicyComponent, AddAddressComponent, VendorCompleteProdcutsComponent],
  imports: [
    CarouselModule,
    BrowserAnimationsModule,
    ImgMagnifier,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskModule.forRoot(),
  ]
})
export class PagesModule { }
