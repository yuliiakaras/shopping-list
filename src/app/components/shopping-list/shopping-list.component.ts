import { Component, OnInit } from '@angular/core';
import { ShoppingListService } from './shopping-list.service';
import { Product } from '../../models/product.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  shoppinglistForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    tags: new FormControl('', [Validators.required])
  });
  constructor(
    private route: ActivatedRoute,
    private shoppingListService: ShoppingListService
    ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      const tagName = queryParams.get('tag');
  
      if (tagName) {
        this.shoppingListService.filterProductsByTag(tagName).subscribe({
          next: products => {
            console.log('Products:', products);
            this.products = products;
          },
          error: error => {
            console.error('Error fetching products', error);
          }
        });
      } else {
        this.shoppingListService.products$.subscribe({
          next: products => {
            console.log('All Products:', products);
            this.products = products;
          },
          error: error => {
            console.error('Error fetching products', error);
          }
        });
      }
    });
  }

  createProduct(): void {
    if (this.shoppinglistForm.valid) {
      const title = this.shoppinglistForm.get('title')?.value as string;
      const description = this.shoppinglistForm.get('description')?.value as string;
      const price = parseFloat(this.shoppinglistForm.get('price')?.value as string);
      const tagsRaw = this.shoppinglistForm.get('tags')?.value as string;
      const tags = tagsRaw.split(/[ ,]+/) ;
      const product: Product = {
        id: 0,
        name: title,
        description,
        price,
        tags
      };
      
      this.shoppingListService.addProduct(product).subscribe({
        next: (addedProduct: Product) => {
          this.products.push(addedProduct);
          this.shoppinglistForm.reset();
        },
        error: (error) => {
          console.error('Error adding product', error);
        }
      });
    }
  }
  deleteProduct(product: Product): void {
    this.shoppingListService.deleteProduct(product.id).subscribe({
      next: (updatedProducts: Product[]) => {
        this.products = updatedProducts;
      },
      error: (error) => {
        console.error('Error deleting product', error);
      }
    });
  }
}
