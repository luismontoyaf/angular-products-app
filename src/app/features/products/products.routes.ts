import { Routes } from '@angular/router';
import { ProductsListComponent } from './pages/list/products-list.component';
import { ProductFormComponent } from './pages/form/product-form.component';
import { ProductDetailComponent } from './pages/detail/product-detail.component';

export const PRODUCT_ROUTES: Routes = [
  { path: '', component: ProductsListComponent },
  { path: 'create', component: ProductFormComponent },
  { path: 'edit/:id', component: ProductFormComponent },
  { path: 'detail/:id', component: ProductDetailComponent }
];