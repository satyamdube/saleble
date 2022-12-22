import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  categoryList: any;
  currentYear: number;
  constructor(
    private homeService: HomeService
  ) { 
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
  this.getAllProductCategory()
  }
  getAllProductCategory = () => {
    this.homeService.getAllProductCategory().subscribe((res) => {
        this.categoryList = res;
     })
  }
}
