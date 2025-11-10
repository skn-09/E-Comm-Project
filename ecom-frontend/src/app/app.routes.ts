import { Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { CategoryComponent } from './components/dashboard/category/category';
import { CategoryOverviewComponent } from './components/dashboard/overview/overview';
import { ProductListComponent } from './components/products/products-list/products-list';
import { ProductDetailComponent } from './components/products/product-detail/product-detail';
import { CartComponent } from './components/cart/cart';
import { NotFoundComponent } from './components/not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: DashboardComponent,
    children: [
      { path: '', component: CategoryOverviewComponent },
      { path: 'category/:name', component: CategoryComponent }
    ]
  },
  { path: 'cart', component: CartComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' }
];
