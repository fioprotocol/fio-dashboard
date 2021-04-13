export const prefix = 'form';

export const UPDATE_FORM_STATE = `${prefix}/UPDATE_FORM_STATE`;

export const updateFormState = (form, state) => ({
  type: UPDATE_FORM_STATE,
  form,
  payload: state,
});
