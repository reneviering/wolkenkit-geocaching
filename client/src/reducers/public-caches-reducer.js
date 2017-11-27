const initialState = {
  caches: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'RECEIVE_PUBLIC_CACHES':
      return { ...state, caches: [ ...action.caches ]};
    case 'CACHE_PUBLISHED':
      return { ...state, caches: [ ...state.caches, action.cache ]};
    default:
      return state;
  }
}
