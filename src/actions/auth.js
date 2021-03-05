import Swal from "sweetalert2";

import { fetchWithoutToken, fetchWithToken } from "../helpers/fetch"
import { types } from "../types/types";
import { eventClearState } from "./events";

export const startLogin = (email, password) => {
  return async ( dispatch ) => {
    const res = await fetchWithoutToken('auth', {email, password}, 'POST');
    const body = await res.json();

    if( body.ok ) {
      localStorage.setItem('token', body.token);
      localStorage.setItem('token-init-date', new Date().getTime());

      dispatch(login({ uid: body.uid, name: body.name }));
    } else {
      Swal.fire('Error', body.msg, 'error');
    }
  }
}

export const startRegister = (email, password, name) => {
  return async (dispatch) => {
    const res = await fetchWithoutToken('auth/new', {email, password, name}, 'POST');
    const body = await res.json();

    if( body.ok ) {
      localStorage.setItem('token', body.token);
      localStorage.setItem('token-init-date', new Date().getTime());

      dispatch(login({ uid: body.uid, name: body.name }));
    } else {
      Swal.fire('Error', body.msg, 'error');
    }
  }
}

const login = (user) => (
  {
    type: types.authLogin,
    payload: user
  }
);

export const startTokenRenew = () => {
  return async (dispatch) => {
    const res = await fetchWithToken('auth/renew');
    const body = await res.json();

    if( body.ok ) {
      localStorage.setItem('token', body.token);
      localStorage.setItem('token-init-date', new Date().getTime());

      dispatch(login({ uid: body.uid, name: body.name }));
    } else {
      dispatch(authCheckingFinish());
    }
  }
}

const authCheckingFinish = () => ({
  type: types.authStartTokenRenew
})

export const startLogout = () => {
  return (dispatch) => {
    localStorage.clear();
    dispatch(eventClearState());
    dispatch(logout());
  }
}

const logout = () => (
  {
    type: types.authLogout
  }
);