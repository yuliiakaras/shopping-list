import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Product } from '../../models/product.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private shoppingListService: ShoppingListService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.product = this.shoppingListService.getProductById(productId);
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  editProduct(product: Product): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '600px',
      data: {
        product
      }
    });
  
    dialogRef.afterClosed().pipe(take(1)).subscribe({
      next: (result: any) => {
        if (result && result.product) {
          result.product.tags = Array.from(new Set(String(result.product.tags).split(/[ ,]+/)));
  
          this.shoppingListService.updateProduct(result.product.id, result.product).subscribe({
            next: (updatedProduct) => {
              console.log('Product updated:', updatedProduct);
            },
            error: (error) => {
              console.error('Error updating product', error);
            }
          });
        }
      }
    });
  }
  deleteProduct(): void {
    if (this.product) {
      this.shoppingListService.deleteProduct(this.product.id).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error deleting product', error);
        }
      });
    }
  }
}
