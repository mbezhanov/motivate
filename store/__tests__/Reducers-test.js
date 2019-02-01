import * as types from '../actions/actionTypes';
import quotesReducer from '../reducers/quotes';
import uiReducer from '../reducers/ui';

describe('Quotes reducer', () => {
  const quote = { id: 123, content: 'lorem', author: 'ipsum', book: 'dolor' };

  it('should return the default state', () => {
    const expectedState = { selectedQuote: null };
    expect(quotesReducer(undefined, {})).toEqual(expectedState);
  });

  it('should handle the SET_SELECTED_QUOTE action', () => {
    const initialState = { selectedQuote: null };
    const expectedState = { selectedQuote: quote };
    expect(quotesReducer(initialState, { type: types.SET_SELECTED_QUOTE, quote })).toEqual(expectedState);
  });

  it('should handle the UPDATE_LOADED_QUOTE action', () => {
    const initialState = { selectedQuote: quote };
    const updatedQuote = { id: 123, content: 'foo', author: 'bar', book: 'baz' };
    const expectedState = { selectedQuote: updatedQuote };
    expect(quotesReducer(initialState, { type: types.UPDATE_LOADED_QUOTE, quote: updatedQuote })).toEqual(expectedState);
  });
});

describe('UI reducer', () => {
  it('should return the default state', () => {
    const expectedState = { loading: true, toast: null };
    expect(uiReducer(undefined, {})).toEqual(expectedState);
  });

  it('should handle the LOADING_START action', () => {
    const initialState = { loading: false, toast: null };
    const expectedState = { loading: true, toast: null };
    expect(uiReducer(initialState, { type: types.LOADING_START })).toEqual(expectedState);
  });

  it('should handle the LOADING_FINISH action', () => {
    const initialState = { loading: true, toast: 'abcd' };
    const expectedState = { loading: false, toast: 'efgh' };
    expect(uiReducer(initialState, {
      type: types.LOADING_FINISH,
      message: 'efgh'
    })).toEqual(expectedState);
  });

  it('should handle the CLEAR_TOAST action', () => {
    const initialState = { loading: false, toast: 'lorem ipsum dolor' };
    const expectedState = { loading: false, toast: null };
    expect(uiReducer(initialState, { type: types.CLEAR_TOAST })).toEqual(expectedState);
  });
});
