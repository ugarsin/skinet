import { Component, inject, input } from '@angular/core';
import { CartItem } from '../../../shared/models/cart';
import { RouterLink } from "@angular/router";
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-item',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    CurrencyPipe
  ],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
  item = input.required<CartItem>();
}
