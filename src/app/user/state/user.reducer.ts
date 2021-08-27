import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as UserActions from './user.actions';

export interface UserState {
  currentUser: string;
  showMask: boolean;
}

const initialState: UserState = {
  currentUser: '',
  showMask: false,
};

const getProductFeatureState = createFeatureSelector<UserState>('users');

export const getShowMask = createSelector(
  getProductFeatureState,
  state => state.showMask
);

export const getCurrentUser = createSelector(
  getProductFeatureState,
  state => state.currentUser
);

export const userReducer = createReducer(
  initialState,
  on(UserActions.toggleUserMask, state => {
    return {
      ...state,
      showMask: !state.showMask
    };
  }),
  on(UserActions.changeUsername, (state, action) => {
    return {
      ...state,
      currentUser: action.username
    };
  })
);
