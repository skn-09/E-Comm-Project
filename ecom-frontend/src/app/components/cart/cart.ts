import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, Cart } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class CartComponent implements OnInit {
  cart?: Cart;
  loading = true;
  showSuccess = false;
  isLoggedIn = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    this.authService.authChanges().subscribe((status) => {
      this.isLoggedIn = status;
      if (status) {
        this.fetchCart();
      } else {
        this.cart = undefined;
        this.showSuccess = false;
        this.loading = false;
        this.cartService.clearCartCache();
        this.cdr.detectChanges();
      }
    });

    if (this.isLoggedIn) {
      this.fetchCart();
    } else {
      this.loading = false;
    }
  }

  fetchCart() {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (res) => {
        this.cart = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching cart:', err);
        this.loading = false;
        if (err.status === 401) {
          this.authService.logout();
        }
        this.cdr.detectChanges();
      },
    });
  }

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId).subscribe({
      next: (cart) => {
        this.cart = cart;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error removing item:', err);
      },
    });
  }

  orderNow() {
    if (!confirm('Do you want to confirm the order?')) {
      return;
    }

    this.cartService.clearCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.showSuccess = true;
        this.orderService.refreshOrdersCount().subscribe({ next: () => {}, error: () => {} });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error clearing cart:', err);
      },
    });
  }

  closeModal() {
    this.showSuccess = false;
    this.cdr.detectChanges();
  }

  getTotal(): number {
    if (!this.cart) {
      return 0;
    }

    return this.cart.items.reduce((sum, item) => {
      const price = item.product.price || 0;
      return sum + price * item.quantity;
    }, 0);
  }
}
