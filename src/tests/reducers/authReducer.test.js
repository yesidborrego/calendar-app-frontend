import { authReducer } from '../../reducers/authReducer';
import { types } from '../../types/types';

import '@testing-library/jest-dom';

const initialState = {
  checking: true,
}

describe('Pruebas en authReducer', () => {


  test('Debe retornar el estado por defecto', () => {
    const state = authReducer(initialState, {});
    expect(state).toEqual(initialState);
  });

  test('Debe retornar los datos del usuario logueado', () => {
    const user = {
      uid: 'ABC123',
      name: 'Isabella'
    }

    const action = {
      type: types.authLogin,
      payload: user
    }

    const state = authReducer(initialState, action);
    expect(state).toEqual({ checking: false, uid: user.uid, name: user.name });
  });

  test('Debe retornar los datos del usuario registrado', () => {
    const user = {
      uid: 'ABC123',
      name: 'Isabella'
    }

    const action = {
      type: types.authStartRegister,
      payload: user
    }

    const state = authReducer(initialState, action);
    expect(state).toEqual({ checking: false, uid: 'ABC123', name: 'Isabella' });
  });

})
