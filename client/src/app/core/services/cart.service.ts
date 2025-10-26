import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Cart, CartItem } from '../../shared/models/cart';
import { Product } from '../../shared/models/products';
import { map } from 'rxjs';
import { nanoid } from 'nanoid';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  cart = signal<Cart | null>(null);
  itemCount = computed(() => {
    return this.cart()?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0
  }); 
  totals = computed(() => {
    const cart = this.cart();
    if (!cart) return null;
    const subtotal = cart.items.reduce((sum, item) => sum + item.price *  item.quantity, 0);
    const shipping = 0;
    const discount = 0;
    return {
      subtotal, 
      shipping,
      discount,
      total: subtotal + shipping - discount
    }
  }); 

  constructor() {
    // 👇 Automatically restore cart if user already has one
    const existingCartId = localStorage.getItem('cart_id');
    if (existingCartId) {
      this.getCart(existingCartId).subscribe({
        next: cart => console.log('Cart loaded', cart),
        error: () => console.log('No existing cart found on server')
      });
    }
  }

  getCart(id: string){
    return this.http.get<Cart>(this.baseUrl + 'cart?id=' + id).pipe(
      map(cart => {
        this.cart.set(cart);
        return cart;
      })
    )
  }

  setCart(cart: Cart) {
    return this.http.post<Cart>(this.baseUrl + 'cart', cart).pipe(
      map(cart => {
        this.cart.set(cart);
        return cart;
      })
    )
  }

  addItemToCart(item: CartItem | Product, quantity = 1) {
    const cart = this.cart() ?? this.createCart();
    if (this.isProduct(item)) {
      item = this.mapProductToCartItem(item);
    }
    cart.items = this.addOrUpdateItem(cart.items, item, quantity);
    // ✅ update local signal immediately
    this.cart.set(cart);

    // ✅ then sync with server asynchronously
    this.setCart(cart).subscribe({
      next: () => console.log('Cart updated on server'),
      error: err => console.error('Failed to sync cart', err)
    });
  }

  addOrUpdateItem(items: CartItem[], item: CartItem, quantity: number): CartItem[] {
    const index = items.findIndex(x => x.productId == item.productId);
    if (index === -1) {
      item.quantity = quantity;
      items.push(item);
    }
    else {
      items[index].quantity += quantity
    }
    return items;
  }

  mapProductToCartItem(item: Product): CartItem {
    return {
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: 0,
      pictureUrl: item.pictureUrl,
      brand: item.brand,
      type: item.type
    }
  }

  private isProduct(item: CartItem | Product) : item is Product {
    return (item as Product).id !== undefined;
  }

  createCart(): Cart {
    const cart = new Cart();
    // ✅ Reuse existing ID or generate new one
    cart.id = localStorage.getItem('cart_id') ?? nanoid();
    cart.items = [];    
    
    // ✅ Save it to localStorage so we remember next time
    localStorage.setItem('cart_id', cart.id);

    return cart;
  }
}
