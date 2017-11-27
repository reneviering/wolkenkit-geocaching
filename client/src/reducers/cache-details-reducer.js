const initialState = {
  cache: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'RECEIVE_CACHE_DETAILS':
      return { ...state, cache: action.cache };
    case 'RECEIVE_CACHE_DETAILS_ERROR':
      return { cache: {}};
    case 'CACHE_FOUND':
      return { cache: { ...state.cache, comments: action.comments, countFindings: action.countFindings }};
    case 'CACHE_COMMENTED':
      return { cache: { ...state.cache, comments: action.comments }};
    default:
      return state;
  }
}
