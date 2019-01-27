import { updateObject } from '../utils';
import { LOADING_START, LOADING_FINISH, CLEAR_TOAST } from '../actions/actionTypes';

const initialState = {
  loading: true,
  toast: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING_START:
      return updateObject(state, { loading: true });
    case LOADING_FINISH:
      return updateObject(state, {
        loading: false,
        toast: action.message || null
      });
    case CLEAR_TOAST:
      return updateObject(state, {
        toast: null
      });
    default:
      return state;
  }
};

export default reducer;
