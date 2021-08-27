import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../product';
import { getCurrentProduct, getError, getProducts, getShowProductCode, State } from '../state';
import { ProductPageActions } from '../state/actions';

@Component({
  templateUrl: './product-shell.component.html'
})
export class ProductShellComponent implements OnInit {
  // products: Product[];
  errorMessage$: Observable<string>;
  displayCode$: Observable<boolean>;
  products$: Observable<Product[]>;
  product$: Observable<Product | null>;
  selectedProduct$: Observable<Product | null>;

  // Não há mais necessidade de importar o serviço no componente
  constructor(private store: Store<State>) { }

  ngOnInit(): void {
    // this.sub = this.productService.selectedProductChanges$.subscribe(
    //   currentProduct => this.selectedProduct = currentProduct
    // );
    // this.productService.getProducts().subscribe({
    //   next: (products: Product[]) => this.products = products,
    //   error: err => this.errorMessage = err
    // });

    this.store.dispatch(ProductPageActions.loadProducts());
    this.products$ = this.store.select(getProducts);
    this.displayCode$ = this.store.select(getShowProductCode);
    this.selectedProduct$ = this.store.select(getCurrentProduct);
    this.errorMessage$ = this.store.select(getError);
  }

  checkChanged(): void {
    this.store.dispatch(ProductPageActions.toggleProductCode());
  }

  newProduct(): void {
    // this.productService.changeSelectedProduct(this.productService.newProduct());
    this.store.dispatch(ProductPageActions.initCurrentProduct());
  }

  productSelected(product: Product): void {
    // this.productService.changeSelectedProduct(product);
    this.store.dispatch(
      ProductPageActions.setCurrentProduct({ currentProductId: product.id }));
  }

  createProduct(product: Product): void {
    this.store.dispatch(ProductPageActions.createProduct({ product }));
  }

  updateProduct(product: Product): void {
    this.store.dispatch(ProductPageActions.updateProduct({ product }));
  }

  deleteProduct(productId: number): void {
    this.store.dispatch(ProductPageActions.deleteProduct({ productId }));
  }

  clearCurrentProduct(): void {
    this.store.dispatch(ProductPageActions.clearCurrentProduct());
  }
}
