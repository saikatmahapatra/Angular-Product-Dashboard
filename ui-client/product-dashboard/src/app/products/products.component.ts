// product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService, Product, ProductFilters } from '../datasources/product.service';
import { CategoryService, Category } from '../datasources/category.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './products.component.html',
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatToolbarModule, MatPaginatorModule],
  styleUrls: ['./products.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  featuredProducts: Product[] = [];
  categories: Category[] = [];
  filters: ProductFilters = {};
  isLoading = false;

  totalRecords = 0;
  itemPerPage = 10; // not working, BE is having 10 by default
  pageIndex = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) { 
    this.filters.page = this.pageIndex + 1;
    this.filters.page_size = this.itemPerPage;
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.getFeatureProducts();
  }

  pageChangeEvent(event: any): void {
    this.pageIndex = event.pageIndex;
    this.itemPerPage = event.pageSize;
    this.filters.page = this.pageIndex + 1;
    this.filters.page_size = event.pageSize;
    this.loadProducts();
  }

  getFeatureProducts() {
    this.isLoading = true;
    this.productService.getFeaturedProducts().subscribe({
      next: (response) => {
        this.featuredProducts = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      }
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts(this.filters).subscribe({
      next: (response) => {
        this.totalRecords = response?.count;
        this.products = response.results;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories.results;
      },
      error: (error) => {
      }
    });
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        }
      });
    }
  }

  toggleFeatured(product: Product): void {
    this.productService.toggleFeatured(product.id, !product.is_featured).subscribe({
      next: (updatedProduct) => {
        const index = this.products.findIndex(p => p.id === product.id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }
      },
      error: (error) => {
        console.error('Error toggling featured:', error);
      }
    });
  }
}