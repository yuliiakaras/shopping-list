import { Component, OnInit } from '@angular/core';
import { ShoppingListService } from './shopping-list.service';
import { Product } from '../../models/product.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  products: Product[] = [];
  shoppinglistForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    tags: new FormControl('', [Validators.required])
  });
  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.shoppingListService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error fetching products', error);
      }
    });
  }

 // shopping-list.component.ts

createProduct(): void {
  if (this.shoppinglistForm.valid) {
    const title = this.shoppinglistForm.get('title')?.value as string;
    const description = this.shoppinglistForm.get('description')?.value as string;
    const price = parseFloat(this.shoppinglistForm.get('price')?.value as string);
    const tagsRaw = this.shoppinglistForm.get('tags')?.value;

    // Check the type of tagsRaw
    const tags = Array.isArray(tagsRaw) ? tagsRaw : (tagsRaw ? [tagsRaw] : []);

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
