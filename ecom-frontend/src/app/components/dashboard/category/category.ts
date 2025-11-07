import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category.html',
  styleUrls: ['./category.css']
})
export class CategoryComponent {
  categoryName = '';
  products: Product[] = [];
  loading = true;
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private ps: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.categoryName = params.get('name') || '';
      this.fetchProductsByCategory();
      this.cdr.detectChanges();
    });
  }

  fetchProductsByCategory() {
    if (!this.categoryName) {
      return;
    }

    this.loading = true;
    this.ps.getProductsByCategory(this.categoryName).subscribe({
      next: res => {
        this.products = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error fetching products by category:', err);
        this.errorMsg = 'Failed to load products';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  addToCart(product: Product) {
    if (product.quantity === 0) {
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.addToCart(product._id, 1).subscribe({
      next: () => {
        this.router.navigate(['/cart']);
      },
      error: err => {
        console.error('Error adding to cart:', err);
        alert('Could not add to cart right now.');
      }
    });
  }
}
