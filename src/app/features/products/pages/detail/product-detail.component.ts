import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../../core/services/products.service';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productsService = inject(ProductsService);

  product = signal<Product | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    const found = this.productsService.getProductById(id);
    if (!found) {
      this.router.navigate(['/products']);
      return;
    }

    this.product.set(found);
  }

  goBack() {
    this.router.navigate(['/products']);
  }

  editProduct() {
    const id = this.product()?.id;
    this.router.navigate(['/products/edit', id]);
  }

}