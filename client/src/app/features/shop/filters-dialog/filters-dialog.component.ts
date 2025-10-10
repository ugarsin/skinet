import { Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectionList, MatListOption } from '@angular/material/list';
import { ShopService } from '../../../core/services/shop.service';
import { MatButton } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-filters-dialog',
  imports: [
    MatDividerModule,
    MatSelectionList,
    MatListOption,
    MatButton
  ],
  templateUrl: './filters-dialog.component.html',
  styleUrl: './filters-dialog.component.scss'
})
export class FiltersDialogComponent {
  shopService = inject(ShopService);
  private dialogRef = inject(MatDialog<FiltersDialogComponent>)
  data = inject(MAT_DIALOG_DATA);

  selectedBrands: string[] = this.data.selectedBrands;
  selectedTypes: string[] = this.data.selectedTypes;
}
