import { updateObject } from '../utils';
import { SET_SELECTED_QUOTE, UPDATE_LOADED_QUOTE } from '../actions/actionTypes';

const initialState = {
  selectedQuote: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_QUOTE:
      return updateObject(state, {
        selectedQuote: action.quote
      });
    case UPDATE_LOADED_QUOTE:
      return updateObject(state, {
        selectedQuote: updateObject(state.selectedQuote, action.quote),
      });
    default:
      return state;
  }
};

export default reducer;
