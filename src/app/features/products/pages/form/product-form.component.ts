import {Component, OnInit, inject, signal, computed} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormBuilder,Validators,FormGroup,ReactiveFormsModule} from '@angular/forms';
import { ProductsService } from '../../../../core/services/products.service';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-products-form',
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductsService);

  product = signal<Product | null>(null);

  isEdit = computed(() => this.product() !== null);

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    price: [0, [Validators.required, Validators.min(1)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    category: ['', Validators.required],
    thumbnail: ['',[Validators.required, Validators.pattern(/^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/)]],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      const prod = this.productService.getProductById(id);
      if (prod) {
        this.product.set(prod);
        this.form.patchValue(prod);
      }
    }
  }

  submit() {
    if (this.form.invalid) return;

    const data: Product = {
      ...this.form.value,
      id: this.product()?.id ?? 0
    };

    if (this.isEdit()) {
      this.productService.updateProduct(data.id, data);
    } else {
      this.productService.addProduct(data);
    }

    this.router.navigate(['/products']);
  }
}
