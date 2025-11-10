import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLinkActive, RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent implements OnInit {
  cartCount = 0;
  isLoggedIn = false;
  ordersCount = 0;

  constructor(
    private router: Router,
    private cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.cartService.cartChanges().subscribe((cart) => {
      this.cartCount = cart?.items.length ?? 0;
    });

    this.authService.authChanges().subscribe((status) => {
      this.isLoggedIn = status;
      if (status) {
        this.loadCart();
        this.orderService.refreshOrdersCount().subscribe({ next: () => {}, error: () => {} });
      } else {
        this.cartCount = 0;
        this.ordersCount = 0;
        this.orderService.orderCountChanges().subscribe(() => {});
      }
    });

    this.orderService.orderCountChanges().subscribe((count) => {
      this.ordersCount = count;
    });

    if (this.isLoggedIn) {
      this.loadCart();
      this.orderService.refreshOrdersCount().subscribe({ next: () => {}, error: () => {} });
    }
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (res) => {
        this.cartCount = res.items.length;
      },
      error: (err) => {
        console.error('Error loading cart:', err);
        if (err.status === 401) {
          this.authService.logout();
          this.isLoggedIn = false;
          this.cartService.clearCartCache();
        }
      },
    });
  }

  loadOrdersCount() {
    this.orderService.getOrdersCount().subscribe({
      next: (res) => {
        this.ordersCount = res.count ?? 0;
      },
      error: (err) => {
        console.error('Error loading orders count:', err);
        if (err.status === 401) {
          this.authService.logout();
          this.ordersCount = 0;
        }
      },
    });
  }

  goToCart() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/cart']);
  }

  goToOrders() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/orders']);
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.cartCount = 0;
    this.cartService.clearCartCache();
    this.orderService.refreshOrdersCount().subscribe({ next: () => {}, error: () => {} });
    this.router.navigate(['/login']);
  }
}
