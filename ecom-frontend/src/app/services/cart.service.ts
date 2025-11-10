import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Product } from './product.service';

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

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = readEnv('NG_APP_CART_BASE_URL', `${apiBaseUrl}/cart`);
  private cartSubject = new BehaviorSubject<Cart | null>(null);

  constructor(private http: HttpClient) {}

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl).pipe(
      tap((cart) => this.cartSubject.next(cart))
    );
  }

  addToCart(productId: string, quantity: number): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/add`, { productId, quantity }).pipe(
      tap((cart) => this.cartSubject.next(cart))
    );
  }

  removeFromCart(productId: string): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/remove/${productId}`).pipe(
      tap((cart) => this.cartSubject.next(cart))
    );
  }

  clearCart(): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/clear`).pipe(
      tap((cart) => this.cartSubject.next(cart))
    );
  }

  cartChanges(): Observable<Cart | null> {
    return this.cartSubject.asObservable();
  }

  clearCartCache() {
    this.cartSubject.next(null);
  }
}
