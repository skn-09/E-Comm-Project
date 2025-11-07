// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Product {
  _id: string;
  name: string;
  price: number;
  rating: number;
  discount: number;
  imageUrl: string;
  description: string;
  material: string;
  moreInfo: string;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = 'http://localhost:3000/api/products'; //  backend

  constructor(private http: HttpClient) {}

  // GET all products
  getProducts(): Observable<Product[]> {
    return this.http.get<{ products: Product[] }>(this.baseUrl).pipe(map((res) => res.products));
  }

  getProductById(id: string): Observable<Product> {
    return this.http
      .get<{ product: Product }>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.product));
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    const url = `${this.baseUrl}?category=${encodeURIComponent(category)}`;
    return this.http.get<{ products: Product[] }>(url).pipe(map((res) => res.products));
  }
}
