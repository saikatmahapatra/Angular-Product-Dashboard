import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import { Product, ProductFilters, ProductService } from '../datasources/product.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatProgressSpinnerModule, MatPaginatorModule, MatSortModule],
  templateUrl: './manage-products.component.html',
  styleUrl: './manage-products.component.scss'
})
export class ManageProductsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'category_name', 'price', 'is_featured'];
  products: Product[] = [];
  isLoading = false;

  totalRecords = 0;
  itemPerPage = 10; // not working, BE is having 10 by default
  pageIndex = 0;

  filterConfig: ProductFilters = {
    page: this.pageIndex + 1,
    page_size: this.itemPerPage
  };

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  pageChangeEvent(event: any): void {
    this.pageIndex = event.pageIndex;
    this.itemPerPage = event.pageSize;
    this.filterConfig.page = this.pageIndex + 1;
    this.filterConfig.page_size = event.pageSize;
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts(this.filterConfig).subscribe({
      next: (response) => {
        this.products = response.results;
        this.totalRecords = response?.count;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      }
    });
  }
}
