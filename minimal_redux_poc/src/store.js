// Topics for understanding
// redux modules for nested stores
// state normalisation
// (normalizer library)

import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers/index';
import * as ActionCreators from './actions';

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
export const store = createStore(
  rootReducer,
  // the npm module used here enables the redux
  // devtools extension, if its available
  // see the package source code on github
  // for the very few things it does
  composeWithDevTools(applyMiddleware(thunkMiddleware)),
);

export const actions = ActionCreators;
export default { actions, store };
