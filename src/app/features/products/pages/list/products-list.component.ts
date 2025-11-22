import { Component, OnInit, signal, effect, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../../../../core/services/products.service';

@Component({
  selector: 'app-products-list',
  imports: [],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent {

  private router = inject(Router);
  private productsService = inject(ProductsService);

  currentPage = signal(1);
  pageSize = 12;

  products = this.productsService.products;

  paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.products().slice(start, end);
  });

  totalPages = computed(() =>
    Math.ceil(this.products().length / this.pageSize)
  );

  goToPage(page: number) {
    this.currentPage.set(page);
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  goToCreate() {
    this.router.navigate(['/products/create']);
  }

  goToDetails(id: number) {
    this.router.navigate(['/products/detail', id]);
  }

  goToEdit(id: number) {
    this.router.navigate(['/products/edit', id]);
  }

  deleteProduct(id: number) {
    const confirmed = confirm('¿Deseas eliminar este producto?');
    if (!confirmed) return;

    this.productsService.deleteProduct(id);
  }
}
