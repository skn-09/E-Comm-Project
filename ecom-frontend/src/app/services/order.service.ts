import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

const readEnv = (key: string, fallback: string): string => {
  const raw =
    (globalThis as any)?.process?.env?.[key] ??
    (typeof import.meta !== 'undefined' ? import.meta.env?.[key] : undefined);
  if (!raw) {
    return fallback;
  }
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

const apiBaseUrl = readEnv('NG_APP_API_BASE_URL', 'http://localhost:3000/api');

export interface OrderItem {
  product: any;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  total: number;
  status?: string;
  canceledAt?: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = `${apiBaseUrl}/orders`;
  private orderCountSubject = new BehaviorSubject<number>(0);

  orderCountChanges() {
    return this.orderCountSubject.asObservable();
  }

  refreshOrdersCount(): Observable<{ count: number }> {
    return this.http
      .get<{ count: number }>(`${this.apiUrl}/count`)
      .pipe(tap((res) => this.orderCountSubject.next(res.count ?? 0)));
  }

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrdersCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/count`);
  }

  cancelOrder(id: string): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/${id}/cancel`, {} as any).pipe(
      tap(() => {
        this.refreshOrdersCount().subscribe({ next: () => {}, error: () => {} });
      })
    );
  }
}
