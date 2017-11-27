import App from './components/App';
import { authenticated } from './components/hocs/auth';
import { connectToWolkenkit } from './wolkenkitSetup';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import reduxThunk from 'redux-thunk';
import registerServiceWorker from './registerServiceWorker';
import rootReducer from './reducers';
import { applyMiddleware, createStore } from 'redux';
import { CacheDetails, OwnCacheList, PublicCacheList, Welcome } from './containers';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(rootReducer);

connectToWolkenkit().then(wolkenkitApp => {
  if (wolkenkitApp.auth.isLoggedIn()) {
		// Dispatch the AUTH_USER action if there is a token in local storage
		// to have the isAuthorized State in the store
    store.dispatch({ type: 'AUTH_USER' });
  }

  ReactDOM.render(
    <HashRouter>
      <Provider store={ store }>
        <App>
          <Switch>
            <Redirect from='/' exact={ true } to='/home' />
            <Route exact={ true } path='/home' component={ Welcome } />
            <Route path='/own-caches' component={ authenticated(OwnCacheList, 'home') } />
            <Route path='/public-caches/:cacheId' component={ authenticated(CacheDetails, 'home') } />
            <Route path='/public-caches' component={ authenticated(PublicCacheList, 'home') } />
          </Switch>
        </App>
      </Provider>
    </HashRouter>
	, document.getElementById('root'));
});

registerServiceWorker();
