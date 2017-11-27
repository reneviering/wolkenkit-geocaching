const initialState = {
  caches: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'CACHE_HIDDEN':
      return { ...state, caches: [ ...state.caches, action.cache ]};
    case 'RECEIVE_OWN_CACHES':
      return { ...state, caches: [ ...action.caches ]};
    case 'CACHE_PUBLISHED':
      return { ...state,
        caches: state.caches.map(cache => {
          if (cache.id !== action.cacheId) {
            return cache;
          }

          return { ...cache, published: true };
        }) };
    case 'CACHE_REMOVED':
      return { ...state,
        caches: state.caches.filter(cache => cache.id !== action.cacheId)
      };
    default:
      return state;
  }
}
