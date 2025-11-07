import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetailComponent implements OnInit {
  product?: Product;
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

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.ps.getProductById(id).subscribe({
        next: (p: Product) => {
          this.product = p;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: err => {
          console.error('Error fetching product:', err);
          this.errorMsg = 'Failed to load product details';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.errorMsg = 'No product ID provided';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  addToCart() {
    if (!this.product?._id || this.product.quantity === 0) {
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.addToCart(this.product._id, 1).subscribe({
      next: () => {
        this.router.navigate(['/cart']);
      },
      error: err => {
        console.error('Error adding to cart:', err);
        alert('Failed to add to cart');
      }
    });
  }
}
