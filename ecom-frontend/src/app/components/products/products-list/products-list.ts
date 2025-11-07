import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService, Product } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './products-list.html',
  styleUrls: ['./products-list.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  errorMsg = '';

  constructor(
    private ps: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ps.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = [...data];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error fetching products:', err);
        this.errorMsg = 'Failed to load products.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  showDetails(product: Product) {
    this.router.navigate(['/products', product._id]);
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
        console.error('Error adding product to cart:', err);
        alert('Could not add to cart right now.');
      }
    });
  }
}
