import { Component, inject, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Product } from '../../../shared/models/products';
import { CurrencyPipe } from '@angular/common';
import { MatButton } from "@angular/material/button";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-item',
  imports: [
    MatCardModule,
    CurrencyPipe,
    MatButton,
    MatIcon,
    MatIconModule,
    RouterLink
],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent {
  @Input() product?: Product;
  cartService = inject(CartService);
}
