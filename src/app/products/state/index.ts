import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from './product.reducer';
import * as AppState from '../../state/app.state';

// apenas necessário porque o módulo é lazy loaded
export interface State extends AppState.State {
  products: ProductState;
}

// seletor da feature
const getProductFeatureState = createFeatureSelector<ProductState>('products');

// seletor da propriedade específica dentro do slice do state
export const getShowProductCode = createSelector(
  getProductFeatureState,
  // projetamos a propriedade a partir do state recebido do seletor
  state => state.showProductCode
);

export const getCurrentProductId = createSelector(
  getProductFeatureState,
  state => state.currentProductId
);

// seletor composto, usa um ou mais seletor simples
export const getCurrentProduct = createSelector(
  getProductFeatureState,
  getCurrentProductId,
  (state, currentProductId) => {
    if (currentProductId === 0) {
      return {
        id: 0,
        productName: '',
        productCode: 'New',
        description: '',
        starRating: 0
      };
    } else {
      return currentProductId ? state.products.find(p => p.id === currentProductId) : null;
    }
  }
);

export const getProducts = createSelector(
  getProductFeatureState,
  state => state.products
);

export const getError = createSelector(
  getProductFeatureState,
  state => state.error
);
