import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewService } from 'src/app/services/review.service';
import { ProductService } from 'src/app/services/product.service';
import { UtilityService } from 'src/app/services/utility.service';
import { CONSTANT } from 'src/app/constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FileuploadService } from 'src/app/services/file-upload.service';
class ImageSnippet {
  pending = false;
  status = 'init';
  constructor(public src: string, public file: File) {
  }
}
@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  orderId: any;
  subOrderId: any;
  public   selectedFile: ImageSnippet;
  orderDetail: any;
  reviewElement = CONSTANT.ratingElements;
  selectedPoints: any;
  reviewForm: FormGroup
  isLoading: boolean;
  isFileUploading: boolean;
  reviewImg: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private reviewService: ReviewService,
    private productService: ProductService,
    private utilityService: UtilityService,
    private fb: FormBuilder,
    private router: Router,
    private fileUploadService: FileuploadService
  ) { 
    this.orderId = this.activatedRoute.snapshot.params.orderId;
    this.subOrderId = this.activatedRoute.snapshot.params.ordersId;
   }

  ngOnInit(): void {
    this.getOrderById();
    this.reviewFormInit();
  }
  reviewFormInit = () =>{
    this.reviewForm = this.fb.group({
      productId: ['', Validators.required],
      rating: ['', Validators.required],
      customerId: ['', Validators.required],
      orderId: ['', Validators.required],
      title: ['', Validators.required],
      orderItemId: ['', Validators.required],
      description: ['', Validators.required],
      photos: [''],
    })
  }
  getOrderById = () => {
    this.utilityService.showPreloader();
    this.productService.getOrderById(this.orderId,this.subOrderId).subscribe((res) => {
      if(res){
        this.orderDetail = res;
        this.reviewForm.patchValue({
          orderId: this.orderId,
          productId: res.productId,
          orderItemId: res._id,
          customerId: JSON.parse(localStorage.getItem('user')).id
        })
        console.log(res)
      }
      this.utilityService.hidePreloader();
    });
  }
  isSelected = (point) => {
    console.log(point)
  }
  onSelectPoint = (item) => {
     this.selectedPoints = item.point;
    this.reviewForm.patchValue({
      rating: item.point,
    })
  }
  onSubmit = () => {
    console.log(this.reviewForm.value);
    this.reviewService.addReview(this.reviewForm.value).subscribe((res) => {
      console.log(res);
      if(res){
        this.router.navigateByUrl('/my/orders')
      }
    })
  }
  processFile(imageInput: HTMLInputElement) {
    
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    if (file) {
      this.isLoading = true;
     }
    this.isFileUploading = true;
    // tslint:disable-next-line:no-shadowed-variable
    reader.addEventListener('load', ( event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.selectedFile.pending = true;
       this.fileUploadService.uploadImg(this.selectedFile.file, 'reviewsPhoto').subscribe((res) => {
         if (res.success === true) {
           this.reviewForm.controls.photos.patchValue(res.data.url);
           this.reviewImg = res.data.url;
          }
        this.isLoading = false;
         this.isFileUploading = false;
      });
    });
    if (file) {
       reader.readAsDataURL(file);
    }
  }
}
