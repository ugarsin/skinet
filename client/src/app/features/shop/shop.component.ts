import { Component, inject, OnInit, signal } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../shared/models/products';
import { MatCardModule } from '@angular/material/card';
import { ProductItemComponent } from "./product-item/product-item.component";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';

@Component({
  selector: 'app-shop',
  imports: [
    MatCardModule,
    ProductItemComponent,
    MatButton,
    MatIcon
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  private shopService = inject(ShopService);
  private dialogService = inject(MatDialog);
  products: Product[] = [];
  selectedBrands: string[] = [];
  selectedTypes: string[] = [];
  
  ngOnInit(): void {
    this.initialiseShop();
  }

  initialiseShop(){
    this.shopService.getTypes();
    this.shopService.getBrands();
    this.shopService.getProducts().subscribe({
      next: response => {
        console.log(response);
        this.products = response.data;
      },
      // next: data => console.log(data),
      error: error => console.log(error),
      complete: () => {
        console.log(this.products)
        console.log('complete')
      }
    });
  }

  openFiltersDialog() {
    const dialogRef = this.dialogService.open(FiltersDialogComponent, {
      minWidth: '500px',
      data: {
        selectedBrands: this.selectedBrands,
        selectedTypes: this.selectedTypes
      }
    });
    dialogRef.afterClosed().subscribe({
      next: result => {
        if (result) {
          console.log(result);
          this.selectedBrands = result.selectedBrands;
          this.selectedTypes = result.selectedTypes;
          // apply filters
        }
      }
    })
  }
}
