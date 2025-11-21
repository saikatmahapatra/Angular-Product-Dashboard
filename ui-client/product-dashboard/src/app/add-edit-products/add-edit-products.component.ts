import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { Category, CategoryService } from '../datasources/category.service';
import { ProductService } from '../datasources/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-add-edit-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatRadioModule, MatButtonModule],
  templateUrl: './add-edit-products.component.html',
  styleUrl: './add-edit-products.component.scss'
})


export class AddEditProductsComponent implements OnInit {
  addForm = {
    title: '',
    description: '',
    category: 0,
    price: '',
    is_featured: false,
    image_url: ''
  }

  categories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
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

  goToProductList() {
    this.router.navigate(['/manage-products']);
  }

  saveProduct(action: string) {
    if (action === 'add') {
      this.productService.createProduct(this.addForm).subscribe({
        next: (response) => {
          this.goToProductList();
        },
        error: (error) => {
        }
      });
    }
  }
}
