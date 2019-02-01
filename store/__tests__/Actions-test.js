import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Quotes from '../../services/Quotes';
import { Image } from 'react-native';
import * as types from '../actions/actionTypes';
import * as quotesActionCreator from '../actions/quotes';
import * as uiActionCreators from '../actions/ui';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const testQuote = { id: 123, content: 'foo', author: 'bar', book: 'baz' };

jest.mock('../../services/Quotes');
jest.mock('Image', () => ({
  prefetch: jest.fn(),
}));

describe('Quotes action creators', () => {
  it('can create an action for loading a random quote from the database', () => {
    Quotes.random.mockResolvedValueOnce(testQuote);
    Image.prefetch.mockResolvedValueOnce();
    const store = mockStore({ quotes: {} });
    const expectedActions = [
      { type: types.LOADING_START },
      { type: types.SET_SELECTED_QUOTE, quote: testQuote },
      { type: types.LOADING_FINISH, message: null }
    ];

    return store
      .dispatch(quotesActionCreator.loadRandomQuote())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(Quotes.random).toBeCalledTimes(1);
        expect(Image.prefetch).toBeCalledTimes(1);
      });
  });

  it('will dispatch the appropriate action if the quote selection fails', () => {
    Quotes.random.mockRejectedValueOnce();
    const store = mockStore({ quotes: {} });
    const expectedActions = [
      { type: types.LOADING_START },
      { type: types.LOADING_FINISH, message: 'error' },
      ];

    return store
      .dispatch(quotesActionCreator.loadRandomQuote())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('will dispatch an action for loading a new quote, after the currently loaded quote is successfully deleted', () => {
    Quotes.remove.mockResolvedValueOnce();
    Quotes.random.mockResolvedValueOnce();
    const store = mockStore({ quotes: { selectedQuote: testQuote } });

    // these actions below should be invoked as a result of dispatching "loadRandomQuote()":
    const expectedActions = [
      { type: types.LOADING_START },
      { type: types.SET_SELECTED_QUOTE, quote: null },
      { type: types.LOADING_FINISH, message: null },
    ];

    return store
      .dispatch(quotesActionCreator.deleteCurrentQuote())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('will dispatch the appropriate action if a quote deletion fails', () => {
    Quotes.remove.mockRejectedValueOnce();
    const store = mockStore({ quotes: { selectedQuote: testQuote } });
    const expectedActions = [{ type: types.LOADING_FINISH, message: 'error' }];

    return store
      .dispatch(quotesActionCreator.deleteCurrentQuote())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('can create an action for updating the displayed quote, without reloading it from the database', () => {
    const expectedAction = {
      type: types.UPDATE_LOADED_QUOTE,
      quote: testQuote,
    };
    expect(quotesActionCreator.updateLoadedQuote(testQuote)).toEqual(expectedAction);
  });
});

describe('UI action creators', () => {
  it('can create an action for putting the UI in a loading state', () => {
    const expectedAction = { type: types.LOADING_START };
    expect(uiActionCreators.loadingStart()).toEqual(expectedAction);
  });

  it('can create an action for putting the UI out of a loading state', () => {
    const testMessage = 'lorem ipsum dolor';
    const expectedAction = {
      type: types.LOADING_FINISH,
      message: testMessage,
    };
    expect(uiActionCreators.loadingFinish(testMessage)).toEqual(expectedAction);

    // also check what happens when no message is set:
    expectedAction.message = null;
    expect(uiActionCreators.loadingFinish()).toEqual(expectedAction);
  });

  it('can create an action for clearing any remaining Toast messages', () => {
    const expectedAction = { type: types.CLEAR_TOAST };
    expect(uiActionCreators.clearToast()).toEqual(expectedAction);
  })
});
