export default function (state = { isAuthenticated: false }, action) {
  switch (action.type) {
    case 'REQUEST_LOGIN':
      return { ...state, isAuthenticated: false };
    case 'AUTH_USER':
      return { ...state, isAuthenticated: true };
    case 'UNAUTH_USER':
      return { ...state, isAuthenticated: false };
    default:
      return state;
  }
}
