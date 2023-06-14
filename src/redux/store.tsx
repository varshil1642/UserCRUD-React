import userReducer from "./reducers/userReducer";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";

var initialState = {
  userList: [],
  user: {},
  token: null,
};

try {
  initialState = localStorage.getItem("redux_state")
    ? JSON.parse(localStorage.getItem("redux_state")!)
    : initialState;
} catch (error) {
  console.log("getError", error);
}

const syncLocalStorage = (store: any) => (next: any) => (action: any) => {
  let stateToSave = store.getState();
  localStorage.setItem("redux_state", JSON.stringify({ ...stateToSave }));
  return next(action);
};

const store = createStore(userReducer, initialState, applyMiddleware(syncLocalStorage));

export default store;
