import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from './datasources/product.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'product-dashboard';
  loading = false;
  cartItemsCount = 0;

  constructor(
    private productService: ProductService
  ) {

  }
  ngOnInit(): void {
    this.productService.cartUpdated.subscribe((val) => {
      this.cartItemsCount = JSON.parse(localStorage.getItem('productCart') || '[]').length;
    });
  }

}
