import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Swal from 'sweetalert2';

import { startLogin, startRegister } from '../../../actions/auth';
import { LoginScreen } from '../../../components/auth/LoginScreen';

import '@testing-library/jest-dom';

jest.mock('../../../actions/auth', () => ({
  startLogin: jest.fn(),
  startRegister: jest.fn()
}))

jest.mock('sweetalert2', () => ({
  fire: jest.fn()
}))

const middleware = [thunk];
const mockStore = configureStore(middleware);
const initialState = {};
const store = mockStore(initialState);

store.dispatch = jest.fn();

const wrapper = mount(
  <Provider store={ store }>
    <LoginScreen />
  </Provider>
);

describe('Prueba del componente <LoginScreen />', () => {

  beforeEach( () => {
    jest.clearAllMocks();
  });

  test('Debe mostrarse correctamente el componente', () => {
    expect(wrapper).toMatchSnapshot();
  })

  test('Debe llamar el dispatch del login', () => {
    wrapper.find("input[name='lEmail']").simulate('change', {
      target: {
        name: 'lEmail',
        value: 'isabella@test.com'
      }
    });

    wrapper.find("input[name='lPassword']").simulate('change', {
      target: {
        name: 'lPassword',
        value: '12345678'
      }
    });

    wrapper.find('form').at(0).prop('onSubmit')({
      preventDefault(){}
    });

    expect(startLogin).toHaveBeenLastCalledWith('isabella@test.com', '12345678');

  })

  test('No hay regsitro si las contraseñas no son iguales', () => {
    wrapper.find("input[name='rPassword']").simulate('change', {
      target: {
        name: 'rPassword',
        value: '123456789'
      }
    });

    wrapper.find("input[name='rPassword_confirm']").simulate('change', {
      target: {
        name: 'rPassword_confirm',
        value: '12345678'
      }
    });

    wrapper.find('form').at(1).prop('onSubmit')({
      preventDefault(){}
    });

    expect(startRegister).toHaveBeenCalledTimes(0); // Opcióm 1
    expect(startRegister).not.toHaveBeenCalled(); // Opción 2
    expect(Swal.fire).toHaveBeenCalledWith('Error', 'Password and confirmation password must be the same', 'error');

  });

  test('Regsitrar usuario si las contraseñas son iguales', () => {
    wrapper.find("input[name='rPassword']").simulate('change', {
      target: {
        name: 'rPassword',
        value: '12345678'
      }
    });

    wrapper.find("input[name='rPassword_confirm']").simulate('change', {
      target: {
        name: 'rPassword_confirm',
        value: '12345678'
      }
    });

    wrapper.find('form').at(1).prop('onSubmit')({
      preventDefault(){}
    });

    expect(startRegister).toHaveBeenCalledWith('vanesa@test.com', '12345678', 'Vanesa');
    expect(Swal.fire).not.toHaveBeenCalled();
  })
})
