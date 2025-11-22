import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {

  private readonly STORAGE_KEY = 'products_data';

  products = signal<Product[]>([]);

  totalProducts = computed(() => this.products().length);

  constructor() {
    localStorage.removeItem(this.STORAGE_KEY);

    this.loadInitialData();
  }

  async loadInitialData() {
    const response = await fetch('https://dummyjson.com/products?limit=50');
    const data = await response.json();

    const ordered = data.products.sort((a: any, b: any) => b.id - a.id);

    this.products.set(ordered);
  }

  private saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.products()));
  }

  getProductById(id: number) {
    return this.products().find(p => p.id === id) || null;
  }

  addProduct(product: Product) {
    const newId = this.generateId();
    const newProduct = { ...product, id: newId };

    this.products.update(items => [...items, newProduct].sort((a, b) => b.id - a.id));
    this.saveToStorage();
  }

  updateProduct(id: number, updated: Product) {
    this.products.update(items =>
      items.map(p => p.id === id ? { ...p, ...updated } : p)
    );

    this.saveToStorage();
  }

  deleteProduct(id: number) {
    this.products.update(items => items.filter(p => p.id !== id));

    this.saveToStorage();
  }

  private generateId(): number {
    const ids = this.products().map(p => p.id);
    return Math.max(...ids) + 1;
  }
}