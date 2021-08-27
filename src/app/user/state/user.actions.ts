import { createAction, props } from '@ngrx/store';


export const toggleUserMask = createAction(
  '[User] Toggle User Mask'
);

export const changeUsername = createAction(
  '[User] Change Username',
  props<{username: string}>()
);
