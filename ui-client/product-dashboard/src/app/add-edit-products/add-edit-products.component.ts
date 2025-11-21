import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { Category, CategoryService } from '../datasources/category.service';
import { Product, ProductService } from '../datasources/product.service';
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
  addForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    category: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    price: new FormControl('', [Validators.required]),
    is_featured: new FormControl(false),
    image_url: new FormControl('', [Validators.required])
  });

  categories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
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
      const payload: Partial<Product> = {
        title: this.addForm.value.title!,
        description: this.addForm.value.description!,
        category: this.addForm.value.category!,
        price: this.addForm.value.price!,
        is_featured: this.addForm.value.is_featured!,
        image_url: this.addForm.value.image_url!
      }
      this.productService.createProduct(payload).subscribe({
        next: (response) => {
          this.goToProductList();
        },
        error: (error) => {
        }
      });
    }
  }
}
