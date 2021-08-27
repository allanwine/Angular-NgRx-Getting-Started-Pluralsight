import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../product';
import { GenericValidator } from '../../shared/generic-validator';
import { NumberValidators } from '../../shared/number.validator';

@Component({
  selector: 'pm-product-edit',
  templateUrl: './product-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductEditComponent implements OnInit, OnChanges {
  pageTitle = 'Product Edit';
  @Input() errorMessage: string;
  @Input() selectedProduct: Product;

  @Output() createProduct = new EventEmitter<Product>();
  @Output() updateProduct = new EventEmitter<Product>();
  @Output() deleteProduct = new EventEmitter<number>();
  @Output() clearProduct = new EventEmitter<void>();

  productForm: FormGroup;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder) {

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      productName: {
        required: 'Product name is required.',
        minlength: 'Product name must be at least three characters.',
        maxlength: 'Product name cannot exceed 50 characters.'
      },
      productCode: {
        required: 'Product code is required.'
      },
      starRating: {
        range: 'Rate the product between 1 (lowest) and 5 (highest).'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    // Define the form group
    this.productForm = this.fb.group({
      productName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      productCode: ['', Validators.required],
      starRating: ['', NumberValidators.range(1, 5)],
      description: ''
    });

    // Watch for value changes for validation
    this.productForm.valueChanges.subscribe(
      () => this.displayMessage = this.genericValidator.processMessages(this.productForm)
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedProduct) {
      const product = changes.selectedProduct.currentValue as Product;
      this.displayProduct(product);
    }
  }

  // Also validate on blur
  // Helpful if the user tabs through required fields
  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(this.productForm);
  }

  displayProduct(product: Product | null): void {

    if (product) {
      this.productForm.reset();

      if (product.id === 0) {
        this.pageTitle = 'Add Product';
      } else {
        this.pageTitle = `Edit Product: ${product.productName}`;
      }

      this.productForm.patchValue({
        productName: product.productName,
        productCode: product.productCode,
        starRating: product.starRating,
        description: product.description
      });
    }
  }

  saveProduct(): void {
    if (this.productForm.valid) {
      if (this.productForm.dirty) {
        // Copy over all of the original product properties
        // Then copy over the values from the form
        // This ensures values not on the form, such as the Id, are retained
        const product = { ...this.selectedProduct, ...this.productForm.value };

        if (product.id === 0) {
          this.createProduct.emit(product);
        } else {
          this.updateProduct.emit(product);
        }
      }
    }
  }

  deleteCurrentProduct(): void {
    if (this.selectedProduct && this.selectedProduct.id) {
      if (confirm(`Really delete the product: ${this.selectedProduct.productName}?`)) {
        this.deleteProduct.emit(this.selectedProduct.id);
      }
    } else {
      this.clearProduct.emit();
    }
  }

  cancelEdit(): void {
    this.displayProduct(this.selectedProduct);
  }
}
