import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { ProductsListingComponent } from './pages/products-listing/products-listing.component';
import {ProfileDetailComponent} from "./pages/profile/profile-detail/profile-detail.component";
import {AddressComponent} from "./pages/profile/address/address.component";
import {AuthGuard} from "./services/auth.guard";
import { OffersListingComponent } from './pages/offers-listing/offers-listing.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { OrdersComponent } from './pages/profile/orders/orders.component';
import { CategoryComponent } from './pages/category/category.component';
import { CartComponent } from './pages/cart/cart.component';
import { ReviewComponent } from './pages/review/review.component';
import { CancelOrderComponent } from './pages/profile/cancel-order/cancel-order.component';
import { SearchResultComponent } from './pages/search/search-result/search-result.component';
import { MyReviewComponent } from './pages/profile/my-review/my-review.component';
import { ReturnPolicyComponent } from './pages/return-policy/return-policy.component';
import { TermOfSaleComponent } from './pages/term-of-sale/term-of-sale.component';
import { TermOfUseComponent } from './pages/term-of-use/term-of-use.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { VendorCompleteProdcutsComponent } from './pages/vendor-complete-prodcuts/vendor-complete-prodcuts.component';
const routes: Routes = [
 
  {
    path: '', component:HomeComponent
  },
  {
    path: 'home', component:HomeComponent
  },
  {
    path: 'product-detail/:productName/:id', component:ProductDetailComponent
  },
  {
    path: 'search-result/:keywords',
    component:SearchResultComponent
  },
  {
    path: 'category/:category/:id', component:CategoryComponent
  },
  {
    path: 'product/:categoryName/:catid/:subCategoryName/:id', component:ProductsListingComponent
  },
  {
    path: 'product/:categoryName/:catid/brand/:brand/:id', component:ProductsListingComponent
  },
  {
    path: 'product/:category/:id/:subCategoryName/:subCatId/productCategory/:productCategoryName/:id', component:ProductsListingComponent
  },
  {
    path: 'offers/:offerName/:offerId/:catid/:offerAmount', component:OffersListingComponent
  },
  {
    path: 'wishlist', component:WishlistComponent
  },
  {
    path: 'cart',
    component:CartComponent
  },
  {
    path: 'review/:orderId/:ordersId',
    component:ReviewComponent
  },
  {
    path: 'cancel-order/:orderId/:ordersId',
    component:CancelOrderComponent
  },
  {

    path: 'my/profile',
    canActivate: [AuthGuard],
    data: {
      expectedRole: ['user'],
    },
    component:ProfileDetailComponent
  },
  {
    path: 'my/address',
    canActivate: [AuthGuard],
    data: {
      expectedRole: ['user'],
    },
    component:AddressComponent
  },
  {
    path: 'my/orders',
    canActivate: [AuthGuard],
    data: {
      expectedRole: ['user'],
    },
    component:OrdersComponent
  },
  {
    path: 'my/recent-reveiws',
    canActivate: [AuthGuard],
    data: {
      expectedRole: ['user'],
    },
    component:MyReviewComponent
  },
  {
    path: 'search-result/:brandName/:brandId/:id',
    component:SearchResultComponent
  },{
    path: 'returnpolicy',
    component:ReturnPolicyComponent
  },
  {
    path: 'termofsale',
    component:TermOfSaleComponent
  },
  {
    path: 'termofuse',
    component:TermOfUseComponent
  },
  {
    path: 'privacyPolicy',
    component:PrivacyPolicyComponent
  },
  {
    path: 'seller/:name/:id',
    component:VendorCompleteProdcutsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
