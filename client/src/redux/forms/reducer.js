import * as actions from './actions';

export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case actions.UPDATE_FORM_STATE:
      return {
        ...state,
        [action.form]: action.payload,
      };
    default:
      return state;
  }
}
