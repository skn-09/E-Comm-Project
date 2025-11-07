import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLinkActive, RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent implements OnInit {
  cartCount = 0;
  isLoggedIn = false;

  constructor(
    private router: Router,
    private cartService: CartService,
    private authService: AuthService
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
      } else {
        this.cartCount = 0;
      }
    });

    if (this.isLoggedIn) {
      this.loadCart();
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

  goToCart() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/cart']);
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.cartCount = 0;
    this.cartService.clearCartCache();
    this.router.navigate(['/login']);
  }
}
