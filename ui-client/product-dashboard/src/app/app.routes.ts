import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/assignment',
    pathMatch: 'full'
  },
  {
    path: 'products',
    loadComponent: () => import('./products/products.component').then(m => m.ProductListComponent)
  },
  {
    path: 'assignment',
    loadComponent: () => import('./assignment/assignment.component').then(m => m.AssignmentComponent)
  },
  {
    path: 'manage-products',
    loadComponent: () => import('./manage-products/manage-products.component').then(m => m.ManageProductsComponent)
  },
  {
    path: 'add-edit-product/:id',
    loadComponent: () => import('./add-edit-products/add-edit-products.component').then(m => m.AddEditProductsComponent)
  },
  {
    path: 'my-cart',
    loadComponent: () => import('./my-cart/my-cart.component').then(m => m.MyCartComponent)
  },
  {
    path: '**',
    redirectTo: '/products'
  }
];
