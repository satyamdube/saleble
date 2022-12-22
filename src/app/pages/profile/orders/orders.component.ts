import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orderListings: any;
  breakUpPrice: boolean;
  productData: any;
  orderFilter = 'all'
  constructor(
    private cartService: CartService,
    private utitlityService: UtilityService
  ) { }

  ngOnInit(): void {
    this.getAllOrders();
  }

  getAllOrders = () => {
    let data = '';
    if(this.orderFilter === 'all'){
      data = '';
    } else {
      data = this.orderFilter;
    }
     this.utitlityService.showPreloader();
    this.cartService.getOrder(data).subscribe((res) => {
      if(res){
        this.orderListings = res.reverse();
       }
      this.utitlityService.hidePreloader();
    })
  }
  setCartAttributes = (data) => {
    let text;
    for (const key in data) {
      text = `<span>${key}:</span> ${data[key]}`
    }
    return text;
  }
  viewBreakUpPrice = (orderDetail, orderItemDetail) => {
    this.breakUpPrice = true;
    this.productData = {orderDetail, orderItemDetail}
   }
   filterOrder = () => {

    this.getAllOrders();
  }
}
