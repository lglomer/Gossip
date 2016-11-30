import firebase from 'firebase';

const ROOT_CHANGED = 'petspot/root/ROOT_CHANGED';

const initialState = {
  root: undefined,
};

export default function app(state = initialState, action = {}) {
  switch (action.type) {
    case ROOT_CHANGED:
      return { ...state, ...action.payload }
    default:
      return state;
  }
}

export function appInitialized() {
  return async function(dispatch, getState) {
    // since all business logic should be inside redux actions
    // this is a good place to put your app initialization code
    dispatch(changeAppRoot('login'));
  };
}

export function changeAppRoot(root) {
  return {
    type: ROOT_CHANGED,
    payload: {root},
  };
}

export function login() {
  return async function(dispatch, getState) {
    // login logic would go here, and when it's done, we switch app roots
    dispatch(changeAppRoot('after-login'));
  };
}
