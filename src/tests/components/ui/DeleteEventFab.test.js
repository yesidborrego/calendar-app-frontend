import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { eventStartDelete } from '../../../actions/events';
import { DeleteEventFab } from '../../../components/ui/DeleteEventFab';

import '@testing-library/jest-dom';

const middleware = [thunk];
const mockStore = configureStore(middleware);

const store = mockStore({});

store.dispatch = jest.fn();

jest.mock('../../../actions/events', () => ({
  eventStartDelete: jest.fn()
}));

const wrapper = mount(
  <Provider store={ store }>
    <DeleteEventFab/>
  </Provider>
);

describe('Probar el componente <DeleteEventFab />', () => {
  test('Debe mostrarse correctamente', () => {
    expect(wrapper).toMatchSnapshot();
  })

  test('Debe disparar el eventStartDelete', () => {
    wrapper.find('button').simulate('click');

    expect(eventStartDelete).toHaveBeenCalled();
  })

})
