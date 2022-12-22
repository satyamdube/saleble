import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-navigations',
  templateUrl: './navigations.component.html',
  styleUrls: ['./navigations.component.scss']
})
export class NavigationsComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private cartService: CartService

  ) { }

  ngOnInit(): void {
  }
  logOut(){
    this.auth.logout();
    this.cartService.productsInCart.next(true);
   }
}
