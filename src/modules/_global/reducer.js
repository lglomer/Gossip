const LOGIN_STATE_CHANGED = 'petspot/root/LOGIN_STATE_CHANGED';

const initialState = {
  loginState: null, // 'login' / 'after-login'
};

export default function app(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN_STATE_CHANGED:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function appInitialized() {
  return function (dispatch) {
    // since all business logic should be inside redux actions
    // this is a good place to put your app initialization code
    dispatch(changeAppRoot('login'));
  };
}

export function changeAppRoot(loginState) {
  return {
    type: LOGIN_STATE_CHANGED,
    payload: { loginState },
  };
}

export function loginUser() {
  return (dispatch) => {
    // after login logic would go here, and when it's done, we switch app roots
    dispatch(changeAppRoot('after-login'));
  };
}
