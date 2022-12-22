import { Component, OnInit } from '@angular/core';
import { ReviewService } from 'src/app/services/review.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-my-review',
  templateUrl: './my-review.component.html',
  styleUrls: ['./my-review.component.scss']
})
export class MyReviewComponent implements OnInit {
  myReview: any[];

  constructor(
    private reviewService: ReviewService,
    private utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    this.myReview = [];
    this.getReviews();
  }

  getReviews = () => {
    this.utilityService.showPreloader();
    this.reviewService.getMyReviews().subscribe((res) => {
     if(res){
        res.forEach(element => {
         this.myReview.push({review: element.review[0], product:  element.productId})
      });
      console.log(this.myReview)
        this.utilityService.hidePreloader();
      }
    })
  }
}
