import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css'],
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.loading = false;
      return;
    }

    this.fetchOrders();
  }

  fetchOrders() {
    this.loading = true;
    this.orderService.getOrders().subscribe({
      next: (res) => {
        this.orders = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
        this.loading = false;
        if (err.status === 401) {
          this.authService.logout();
        }
        this.cdr.detectChanges();
      },
    });
  }

  cancelOrder(orderId: string, idx: number) {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    this.orderService.cancelOrder(orderId).subscribe({
      next: (updated) => {
        if (this.orders[idx]) {
          this.orders[idx] = updated as any;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cancelling order:', err);
      },
    });
  }
}
