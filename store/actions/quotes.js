import Quotes from '../../services/Quotes';
import { Image } from 'react-native';
import { loadingStart, loadingFinish } from './ui';
import { SET_SELECTED_QUOTE, UPDATE_LOADED_QUOTE } from './actionTypes';

export const loadRandomQuote = () => {
  return dispatch => {
    dispatch(loadingStart());

    return Quotes
      .random()
      .then(quote => {
        if (!quote) {
          dispatch(setSelectedQuote(null));
          dispatch(loadingFinish());
          return;
        }

        return Image
          .prefetch(quote.imageUrl)
          .then(() => {
            dispatch(setSelectedQuote(quote));
            dispatch(loadingFinish());
          });

      })
      .catch(() => {
        dispatch(loadingFinish('error'));
      });
  };
};

const setSelectedQuote = (quote) => {
  return {
    type: SET_SELECTED_QUOTE,
    quote,
  }
};

export const deleteCurrentQuote = () => {
  return (dispatch, getState) => {
    return Quotes
      .remove(getState().quotes.selectedQuote.id)
      .then(() => {
        dispatch(loadRandomQuote());
      })
      .catch(() => {
        dispatch(loadingFinish('error'));
      });
  }
};

export const updateLoadedQuote = (quote) => {
  return {
    type: UPDATE_LOADED_QUOTE,
    quote,
  }
};
