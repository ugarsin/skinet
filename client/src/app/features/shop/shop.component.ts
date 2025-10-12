import { Component, inject, OnInit, signal } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../shared/models/products';
import { MatCardModule } from '@angular/material/card';
import { ProductItemComponent } from "./product-item/product-item.component";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatSelectionList, MatListOption, MatSelectionListChange } from '@angular/material/list';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ShopParams } from '../../shared/models/shopParams';
import { Pagination } from '../../shared/models/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  imports: [
    MatCardModule,
    ProductItemComponent,
    MatButton,
    MatIcon,
    MatMenuModule, 
    MatSelectionList, 
    MatListOption,
    MatMenuTrigger,
    MatPaginatorModule,
    FormsModule
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  private shopService = inject(ShopService);
  private dialogService = inject(MatDialog);
  products?: Pagination<Product>;
  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price Low-High', value: 'priceAsc'},
    {name: 'Price High-Low', value: 'priceDesc'},
  ];
  shopParams = new ShopParams();
  pageSizeOptions = [5, 10, 15, 20];

  ngOnInit(): void {
    this.initialiseShop();
  }

  initialiseShop(){
    this.shopService.getTypes();
    this.shopService.getBrands();
    this.shopService.getProducts(this.shopParams).subscribe({
      next: response => {
        this.products = response;
      },
      // next: data => console.log(data),
      error: error => console.log(error),
      // complete: () => {
      //   console.log('complete')
      // }
    });
  }

  getProducts() {
    this.shopService.getProducts(this.shopParams).subscribe({
      next: response => {
         this.products = response;
      },
      error: error => console.log(error)
    });
  }

  onSearchChange() {
    console.log(this.shopParams.search);
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  handlePageEvent(event: PageEvent) {
    this.shopParams.pageNumber = event.pageIndex + 1;
    this.shopParams.pageSize = event.pageSize;
    this.getProducts();
  }

  onSortChange(event: MatSelectionListChange) {
    const selectedOption = event.options[0];
    if (selectedOption) {
      this.shopParams.sort = selectedOption.value;
      this.shopParams.pageNumber = 1;
      this.getProducts();
    }
  }

  openFiltersDialog() {
    const dialogRef = this.dialogService.open(FiltersDialogComponent, {
      minWidth: '500px',
      data: {
        selectedBrands: this.shopParams.brands,
        selectedTypes: this.shopParams.types
      }
    });
    dialogRef.afterClosed().subscribe({
      next: result => {
        if (result) {
          this.shopParams.brands = result.selectedBrands;
          this.shopParams.types = result.selectedTypes;
          this.shopParams.pageNumber = 1;
          // apply filters
          this.getProducts();
        }
      }
    })
  }
}
