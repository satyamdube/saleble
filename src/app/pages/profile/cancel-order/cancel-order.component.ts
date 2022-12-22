import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewService } from 'src/app/services/review.service';
import { ProductService } from 'src/app/services/product.service';
import { UtilityService } from 'src/app/services/utility.service';
import { CONSTANT } from 'src/app/constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cancel-order',
  templateUrl: './cancel-order.component.html',
  styleUrls: ['./cancel-order.component.scss']
})
export class CancelOrderComponent implements OnInit {
  orderId: any;
  subOrderId: any;
  orderDetail: any;
  cancelReasons = CONSTANT.cancelReason;
  selectedPoints: any;
  productCancelForm: FormGroup
  constructor(
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,
    private productService: ProductService,
    private utilityService: UtilityService,
    private fb: FormBuilder,
    private router: Router
  ) { 
    this.orderId = this.activatedRoute.snapshot.params.orderId;
    this.subOrderId = this.activatedRoute.snapshot.params.ordersId;
   }

  ngOnInit(): void {
    this.getOrderById();
    this.reviewFormInit();
  }
  reviewFormInit = () =>{
    this.productCancelForm = this.fb.group({
      orderItemId: ['', Validators.required],
      orderId: ['', Validators.required],
      cancellationReason: ['null', Validators.required],
      comment: ['', Validators.required],
     })
  }
  getOrderById = () => {
    this.utilityService.showPreloader();
    this.productService.getOrderById(this.orderId,this.subOrderId).subscribe((res) => {
      if(res){
        this.orderDetail = res;
        this.productCancelForm.patchValue({
          orderId: this.orderId,
          orderItemId: this.subOrderId,
        })
        console.log(res)
      }
      this.utilityService.hidePreloader();
    });
  }
 
 
  onSubmit = () => {
    console.log(this.productCancelForm.value);
      this.cartService.cancelOrder(this.productCancelForm.value).subscribe((res) => {
      console.log(res);
      if(res){
        this.router.navigateByUrl('/my/orders')
      }
    })
  }
}
