import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Swal from 'sweetalert2';

import { startLogin, startRegister, startTokenRenew } from '../../actions/auth';
import * as fetchModule from '../../helpers/fetch';
import { types } from '../../types/types';

import '@testing-library/jest-dom';

jest.mock('sweetalert2', () => ({
  fire: jest.fn()
}))

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const initState = {};
let store = mockStore(initState);

Storage.prototype.setItem = jest.fn();

describe('Probar la acción auth', () => {

  beforeEach( () => {
    store = mockStore(initState);
    jest.clearAllMocks();
  });

  test('startLogin correctamente ', async () => {
    await store.dispatch(startLogin('yesid@test.com', '12345678'));

    const actions = store.getActions();

    expect(actions[0]).toEqual(
      {
        type: types.authLogin,
        payload: {
          uid: expect.any(String),
          name: expect.any(String)
        }
      }
    );

      expect(localStorage.setItem).toHaveBeenCalledWith('token', expect.any(String));
      expect(localStorage.setItem).toHaveBeenCalledWith('token-init-date', expect.any(Number));

      // const token = localStorage.setItem.mock.calls[0][1];
      // console.log(token);
    })

    test('startLogin incorrectamente ', async () => {
      await store.dispatch(startLogin('yesid9@test.com', '12345678'));

      const actions = store.getActions();
      expect(actions).toEqual([]);
      expect(Swal.fire).toHaveBeenCalledWith('Error', 'Invalid email or password.', 'error');
    })

    test('startRegister correctamente', async () => {
      fetchModule.fetchWithoutToken = jest.fn( () => ({
        json() {
          return {
            ok: true,
            uid: '123',
            name: 'testing',
            token: 'ABC123DEF456'
          }
        }
      }));

      await store.dispatch(startRegister('test@test.com', '12345678', 'test'));
      const actions = store.getActions();

      expect(actions[0]).toEqual(
        {
          type: types.authLogin,
          payload: {
            uid: expect.any(String),
            name: expect.any(String)
          }
        }
      );

      expect(localStorage.setItem).toHaveBeenCalledWith('token', expect.any(String));
      expect(localStorage.setItem).toHaveBeenCalledWith('token-init-date', expect.any(Number));
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'ABC123DEF456');
    })

    test('startTokenRenew correctamente', async () => {
      fetchModule.fetchWithToken = jest.fn( () => ({
        json() {
          return {
            ok: true,
            uid: '123',
            name: 'testing',
            token: 'ABC123DEF456'
          }
        }
      }));

      await store.dispatch(startTokenRenew());
      const actions = store.getActions();

      expect(actions[0]).toEqual(
        {
          type: types.authLogin,
          payload: {
            uid: expect.any(String),
            name: expect.any(String)
          }
        }
      );

      expect(localStorage.setItem).toHaveBeenCalledWith('token', expect.any(String));
      expect(localStorage.setItem).toHaveBeenCalledWith('token-init-date', expect.any(Number));
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'ABC123DEF456');
    })

});