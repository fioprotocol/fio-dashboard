import { prefix } from './actions';

export const getFormState = (state, form) =>
  (state[prefix] && state[prefix][form]) || {};
