import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap, switchMap, map } from 'rxjs/operators';
import { Product } from '../../models/product.model';
import { TagService } from '../tags/tag.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private apiUrl = 'assets/data/shopping-list.json';
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$: Observable<Product[]> = this.productsSubject.asObservable();
  private localProducts: Product[] = [];

  constructor(private http: HttpClient, private tagService: TagService) {
    this.getProducts();
  }

  private getProducts(): void {
    this.http.get<Product[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError('getProducts', [])),
        tap(products => {
          this.localProducts = [...products];
          this.updateTagsInService(products);
          this.productsSubject.next(products);
        })
      )
      .subscribe();
  }

  private updateTagsInService(products: Product[]): void {
    const allTags = products.flatMap((product) => product.tags);
    console.log(allTags);
    
    const uniqueTags = [...new Set(allTags)];
    this.tagService.updateTags(uniqueTags);
  }
  
  addProduct(product: Product): Observable<Product> {
    const maxId = Math.max(...this.localProducts.map(a => a.id), 0);
    product.id = maxId + 1;
    this.localProducts.push(product);
    this.updateTagsInService(this.localProducts);
    this.productsSubject.next([...this.localProducts]);
    return of(product);
  }
  

  getProductById(id: number): Product | undefined {
    return this.localProducts.find((product) => product.id === id);
  }

  updateProduct(id: number, product: Product): Observable<Product | any> {
    return of(this.localProducts)
      .pipe(
        tap(products => {
          const index = products.findIndex(a => a.id === id);
          if (index !== -1) {
            products[index] = { ...product, id };
            this.updateTagsInService(products);
            this.productsSubject.next([...products]);
          }
        }),
        catchError(this.handleError('updateProduct', product))
      );
  }

  deleteProduct(id: number): Observable<any> {
    return of(this.localProducts)
      .pipe(
        switchMap(products => {
          const index = products.findIndex(a => a.id === id);
          if (index !== -1) {
            products.splice(index, 1);
            this.updateTagsInService(products);
            this.productsSubject.next([...products]);
          }
          return of(products);
        }),
        catchError(this.handleError('deleteProduct', []))
      );
  }

  filterProductsByTag(tag: string): Observable<Product[]> {
    console.log('hiiii');
    
    return this.products$.pipe(
      map((products) => products.filter((product) => product.tags.includes(tag)))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}


