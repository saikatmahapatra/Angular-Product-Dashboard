import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CartItem, Product, ProductService } from '../datasources/product.service';
@Component({
  selector: 'app-my-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatToolbarModule, MatPaginatorModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './my-cart.component.html',
  styleUrl: './my-cart.component.scss'
})

export class MyCartComponent implements OnInit {
  cartItems: CartItem[] = [];
  isLoading = false;
  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService
  ) {

  }

  ngOnInit(): void {
    this.getCartItems();
  }

  getCartItems() {
    this.cartItems = JSON.parse(localStorage.getItem('productCart') || '[]');
  }

  removeFromCart(itemId: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    localStorage.setItem('productCart', JSON.stringify(this.cartItems));
    this.showSuccessAlert('Item removed from cart successfully!');  
    this.productService.cartUpdated.next(true);
  }

  updateQty(itemId: number, newQty: number) {
    const item = this.cartItems.find(i => i.id === itemId);
    if (item) {
      item.quantity = newQty > 0 ? newQty : 1; // Ensure quantity is at least 1
      localStorage.setItem('productCart', JSON.stringify(this.cartItems));
      this.showSuccessAlert('Item quantity updated successfully!');  
      this.productService.cartUpdated.next(true);
    }
  }

  getTotalAmount() {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  showSuccessAlert(message: string, action: string = 'Close') {
    this.snackBar.open(message, action, {
      duration: 3000, // Duration in milliseconds
      panelClass: [] // Custom CSS class for styling
    });
  }

  continueShopping() {
    this.router.navigate(['/products']);
  }
  

}
