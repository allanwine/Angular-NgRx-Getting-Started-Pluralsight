import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { Product } from './product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = 'api/products';

  private products: Product[];
  private selectedProductSource = new BehaviorSubject<Product | null>(null);
  selectedProductChanges$ = this.selectedProductSource.asObservable();

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  createProduct(product: Product): Observable<Product> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // Product Id must be null for the Web API to assign an Id
    const newProduct = { ...product, id: null };
    return this.http.post<Product>(this.productsUrl, newProduct, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteProduct(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.productsUrl}/${id}`;
    return this.http.delete<Product>(url, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateProduct(product: Product): Observable<Product> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.productsUrl}/${product.id}`;
    return this.http.put<Product>(url, product, { headers })
      .pipe(
        // Update the item in the list
        // This is required because the selected product that was edited
        // was a copy of the item from the array.
        // Return the product on an update
        map(() => product),
        catchError(this.handleError)
      );
  }

  private handleError(err: any) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    return throwError(errorMessage);
  }

}
