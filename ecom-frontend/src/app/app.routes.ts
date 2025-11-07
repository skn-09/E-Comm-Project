import { Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { CategoryComponent } from './components/dashboard/category/category';
import { CategoryOverviewComponent } from './components/dashboard/overview/overview';
import { ProductListComponent } from './components/products/products-list/products-list';
import { ProductDetailComponent } from './components/products/product-detail/product-detail';
import { CartComponent } from './components/cart/cart';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: CategoryOverviewComponent },
      { path: 'category/:name', component: CategoryComponent }
    ]
  },
  { path: 'cart', component: CartComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: '**', redirectTo: 'dashboard' }
];
