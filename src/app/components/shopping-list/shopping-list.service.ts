import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap, switchMap, map } from 'rxjs/operators';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  private apiUrl = 'assets/data/shopping-list.json';
  private productsSubject = new BehaviorSubject<Product[]>([]);

  products$: Observable<Product[]> = this.productsSubject.asObservable();
  private localProducts: Product[] = []; 

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError('getProducts', [])),
        tap(products => {
          this.localProducts = [...products];
          this.productsSubject.next(products);
        })
      );
  }

  addProduct(product: Product): Observable<Product> {
    return of(this.localProducts)
      .pipe(
        map(products => {
          const maxId = Math.max(...products.map(a => a.id), 0);
          product.id = maxId + 1;
          products.push(product);
          return product;
        }),
        catchError(this.handleError('addProduct', product))
      );
  }
  deleteProduct(id: number): Observable<any> {
    return of(this.localProducts)
      .pipe(
        switchMap(products => {
          const index = products.findIndex(a => a.id === id);
          if (index !== -1) {
            products.splice(index, 1);
            this.productsSubject.next([...products]);
          }
          return of(products);
        }),
        catchError(this.handleError('deleteProduct', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
