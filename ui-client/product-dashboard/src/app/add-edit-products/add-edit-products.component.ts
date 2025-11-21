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
  title = 'Add Product';
  action = 'add'; // 'add' or 'edit'
  addForm = new FormGroup({
    id: new FormControl<number | null>(null),
    title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    category: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    price: new FormControl('', [Validators.required, this.priceValidator.bind(this)]),
    is_featured: new FormControl(false),
    image_url: new FormControl('', [Validators.required, Validators.maxLength(200), this.urlValidator.bind(this)]),
  });

  private urlValidator(control: FormControl): { [key: string]: boolean } | null {
    if (!control.value) {
      return null;
    }
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
    return urlRegex.test(control.value) ? null : { invalidUrl: true };
  }

  private priceValidator(control: FormControl): { [key: string]: boolean } | null {
    if (!control.value) {
      return null;
    }
    const priceRegex = /^\d+(\.\d{1,2})?$/;
    return priceRegex.test(control.value) ? null : { invalidPrice: true };
  }

  categories: Category[] = [];
  errorMessages: string[] = [];

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    //check if URL has id param for edit
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const productId = Number(idParam);
      this.title = 'Edit Product';
      this.action = 'edit';
      this.getProductDetails(productId);
    }
  }

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

  getProductDetails(productId: number): void {
    this.productService.getProduct(productId).subscribe({
      next: (product) => {
        this.addForm.patchValue({
          id: product.id,
          title: product.title,
          description: product.description,
          category: product.category,
          price: product.price,
          is_featured: product.is_featured,
          image_url: product.image_url
        });
      },
      error: (error) => {
      }
    });
  }

  goToProductList() {
    this.router.navigate(['/manage-products']);
  }

  getFieldError(fieldName: string): string | null {
    const control = this.addForm.get(fieldName);
    if (!control || !control.errors || !control.touched) {
      return null;
    }

    const labels: Record<string, string> = {
      title: 'Title',
      description: 'Description',
      category: 'Category',
      price: 'Price',
      is_featured: 'Featured',
      image_url: 'Image URL'
    };

    const label = labels[fieldName] || fieldName;
    const errs = control.errors;

    if (errs['required']) return `${label} is required.`;
    if (errs['maxlength']) return `${label} must be at most ${errs['maxlength'].requiredLength} characters.`;
    if (errs['minlength']) return `${label} must be at least ${errs['minlength'].requiredLength} characters.`;
    if (errs['min']) return `${label} must be at least ${errs['min'].min}.`;
    if (errs['max']) return `${label} must be at most ${errs['max'].max}.`;
    if (errs['pattern']) return `${label} is invalid.`;
    if (errs['invalidPrice']) return `${label} must be a valid price (up to 2 decimal places).`;
    if (errs['invalidUrl']) return `${label} must be a valid URL.`;

    return null;
  }

  hasFieldError(fieldName: string): boolean {
    const control = this.addForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  clearForm() {
    this.addForm.reset({
      title: '',
      description: '',
      category: null,
      price: '',
      is_featured: false,
      image_url: ''
    });
  }

  saveProduct(action: string) {
    if (action === 'add' && this.addForm.valid) {
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
    else if (action === 'edit' && this.addForm.valid) {
      const productId = this.addForm.value.id!;
      const payload: Partial<Product> = {
        title: this.addForm.value.title!,
        description: this.addForm.value.description!,
        category: this.addForm.value.category!,
        price: this.addForm.value.price!,
        is_featured: this.addForm.value.is_featured!,
        image_url: this.addForm.value.image_url!
      }
      this.productService.updateProduct(productId, payload).subscribe({
        next: (response) => {
          this.goToProductList();
        },
        error: (error) => {
        }
      });
    }
  }
}
