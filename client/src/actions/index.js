import { getWolkenkitApp } from '../wolkenkitSetup';

export const login = () => {
  getWolkenkitApp().auth.login();

  return { type: 'REQUEST_LOGIN' };
};

export const logout = () => {
  getWolkenkitApp().auth.logout();

  return { type: 'UNAUTH_USER' };
};

export const hideCache = (name, description, coordinate) => dispatch => {
  getWolkenkitApp().geocaching.cache().hide({
    name,
    description,
    coordinate
  })
  .await('hidden', event => {
    dispatch({
      type: 'CACHE_HIDDEN',
      cache: { ...event.data, id: event.aggregate.id }
    });
  });
};

export const findCache = (cacheId, text) => dispatch => new Promise((resolve, reject) => {
  getWolkenkitApp().geocaching.cache(cacheId).find({
    text
  })
  .failed(err => {
    reject(err.message);
  })
  .await('found', event => {
    dispatch({ type: 'CACHE_FOUND', comments: event.data.comments, countFindings: event.data.countFindings });
    resolve();
  });
});

export const publishCache = cacheId => dispatch => {
  getWolkenkitApp().geocaching.cache(cacheId).publish()
  .await('published', () => {
    dispatch({
      type: 'CACHE_PUBLISHED',
      cacheId
    });
  });
};

export const commentCache = (cacheId, text) => dispatch => {
  getWolkenkitApp().geocaching.cache(cacheId).comment({
    text
  })
  .await('commented', event => {
    dispatch({ type: 'CACHE_COMMENTED', comments: event.data.comments });
  });
};

export const removeCache = cacheId => dispatch => {
  getWolkenkitApp().geocaching.cache(cacheId).remove()
  .await('removed', () => {
    dispatch({ type: 'CACHE_REMOVED', cacheId });
  });
};

export const requestAndObserveOwnCaches = () => dispatch => new Promise(resolve => {
  const dispatchReceiveOwnCaches = (caches, cancel) => {
    dispatch({ type: 'RECEIVE_OWN_CACHES', caches });
    resolve(cancel);
  };

  getWolkenkitApp().lists.ownCaches.readAndObserve({
    orderBy: { timestamp: 'descending' }
  })
  .started(dispatchReceiveOwnCaches)
  .updated(dispatchReceiveOwnCaches);
});

export const requestPublicCaches = () => dispatch => {
  getWolkenkitApp().lists.publicCaches.read()
  .finished(caches => {
    dispatch({ type: 'RECEIVE_PUBLIC_CACHES', caches });
  });
};

export const requestCacheDetails = cacheId => dispatch => {
  getWolkenkitApp().lists.publicCaches.readOne({
    where: { id: cacheId }
  })
  .finished(cache => {
    dispatch({ type: 'RECEIVE_CACHE_DETAILS', cache });
  })
  .failed(() => {
    dispatch({ type: 'RECEIVE_CACHE_DETAILS_ERROR' });
  });
};

export const observeComments = () => dispatch => new Promise(resolve => {
  getWolkenkitApp().events.observe()
  .received((event, cancel) => {
    if (event.name === 'found') {
      dispatch({ type: 'CACHE_FOUND', comments: event.data.comments, countFindings: event.data.countFindings });
    }
    if (event.name === 'commented') {
      dispatch({ type: 'CACHE_COMMENTED', comments: event.data.comments });
    }
    resolve(cancel);
  });
});

export const observeCachePublishing = () => dispatch => new Promise(resolve => {
  getWolkenkitApp().events.observe()
  .received((event, cancel) => {
    if (event.name === 'published') {
      dispatch({ type: 'CACHE_PUBLISHED', cache: { ...event.data, id: event.aggregate.id }});
    }
    resolve(cancel);
  });
});
