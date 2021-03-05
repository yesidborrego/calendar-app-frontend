import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { AppRouter } from '../../router/AppRouter';

import '@testing-library/jest-dom';

const middleware = [thunk];
const mockStore = configureStore(middleware);

// store.dispatch = jest.fn();

describe('Probar el componente <AppRouter />', () => {
  test('Debe mostrar Wait..', () => {
    const initialState = {
      auth: {
        checking: true,
      }
    };
    const store = mockStore(initialState);

    const wrapper = mount(
      <Provider store={ store }>
        <AppRouter />
      </Provider>
    );

    // expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('h3').exists()).toBe( true );
  })

  test('Debe mostrar la ruta pública', () => {
    const initialState = {
      auth: {
        checking: false,
      }
    };
    const store = mockStore(initialState);

    const wrapper = mount(
      <Provider store={ store }>
        <AppRouter />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('.login-container').exists()).toBe( true );
  })

  test('Debe mostrar la ruta privada', () => {
    const initialState = {
      ui: {
        openModal: false
      },
      calendar: {
        events: []
      },
      auth: {
        checking: false,
        uid: 'ABC123',
        name: 'Test'
      }
    };
    const store = mockStore(initialState);

    const wrapper = mount(
      <Provider store={ store }>
        <AppRouter />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('.calendar-screen').exists()).toBe( true );
  })

});
