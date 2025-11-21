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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-add-edit-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatRadioModule, MatButtonModule, MatSnackBarModule, MatProgressSpinnerModule],
  templateUrl: './add-edit-products.component.html',
  styleUrl: './add-edit-products.component.scss'
})


export class AddEditProductsComponent implements OnInit {
  title = '';
  action = ''; // 'add' or 'edit'
  isLoading = false;
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
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    //check if URL has id param for edit
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const productId = Number(idParam);
      this.title = 'Edit Product';
      this.action = 'edit';
      this.getProductDetails(productId);
    } else {
      this.title = 'Add Product';
      this.action = 'add';
    }
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories.results;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      }
    });
  }

  getProductDetails(productId: number): void {
    this.isLoading = true;
    this.productService.getProduct(productId).subscribe({
      next: (product) => {
        this.isLoading = false;
        this.addForm.patchValue({
          id: product.id,
          title: product.title ? product.title : '',
          description: product.description ? product.description : '',
          category: product.category ? product.category : null,
          price: product.price ? product.price : '',
          is_featured: product.is_featured ? product.is_featured : false,
          image_url: product.image_url ? product.image_url : ''
        });
      },
      error: (error) => {
        this.isLoading = false;
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

  addProduct() {
    if (this.addForm.valid && this.addForm.value.id == null) {
      this.isLoading = true;
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
          this.isLoading = false;
          this.goToProductList();
          this.showSuccessAlert('Product added successfully!');
        },
        error: (error) => {
          this.isLoading = false;
        }
      });
    }
  }

  updateProduct() {
    if (this.addForm.valid && this.addForm.value.id != null) {
      this.isLoading = true;
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
          this.isLoading = false;
          this.goToProductList();
          //this.getProductDetails(productId);
          this.showSuccessAlert('Product updated successfully!');
        },
        error: (error) => {
          this.isLoading = false;
        }
      });
    }
  }

  showSuccessAlert(message: string, action: string = 'Close') {
    this.snackBar.open(message, action, {
      duration: 3000, // Duration in milliseconds
      panelClass: [] // Custom CSS class for styling
    });
  }
}
