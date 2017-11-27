import authReducer from './auth-reducer';
import cacheDetailReducer from './cache-details-reducer';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import ownCachesReducer from './own-caches-reducer';
import publicCachesReducer from './public-caches-reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  ownCaches: ownCachesReducer,
  publicCaches: publicCachesReducer,
  cacheDetails: cacheDetailReducer,
  form: formReducer
});

export default rootReducer;
