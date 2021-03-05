import { act } from "@testing-library/react";
import { mount } from "enzyme"
import React from 'react';
import { Provider } from "react-redux";
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { eventSetActive } from "../../../actions/events";
import { uiOpenModal } from "../../../actions/ui";
import { CalendarScreen } from "../../../components/calendar/CalendarScreen";
import { calendarLangEs } from "../../../helpers/calendar-lang-es";

jest.mock('../../../actions/ui', () => ({
  uiOpenModal: jest.fn()
}));

jest.mock('../../../actions/events', () => ({
  eventSetActive: jest.fn(),
  eventStartLoad: jest.fn()
}));

const middleware = [thunk];
const mockStore = configureStore(middleware);
const initialState = {
  ui: {
    openModal: false
  },
  calendar: {
    events: []
  },
  auth: {
    uid: 'ABC123',
    name: 'Test'
  }
};
const store = mockStore(initialState);
store.dispatch = jest.fn();
Storage.prototype.setItem = jest.fn();

const wrapper = mount(
  <Provider store={ store }>
    <CalendarScreen />
  </Provider>
);

describe('Probar el componente <CalendarScreen />', () => {

  beforeEach( () => {
    jest.clearAllMocks();
  });

  test('Debe mostrar correctamente el componente', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('Pruebas con las acciones del calendario', () => {
    const calendar = wrapper.find('Calendar');

    const calendarMsg = calendar.prop('messages');
    expect(calendarMsg).toEqual(calendarLangEs);

    calendar.prop('onDoubleClickEvent')();
    expect(uiOpenModal).toHaveBeenCalled();
    /* expect( store.dispatch ).toHaveBeenCalledWith({ type: types.uiOpenModal }); // No me funcionó */

    calendar.prop('onSelectEvent')({start: 'hello'});
    expect(eventSetActive).toHaveBeenCalledWith({start: 'hello'});

    act( () => {
      calendar.prop('onView')('week');
      expect(localStorage.setItem).toHaveBeenCalledWith('lastView', 'week');
    });
  });

})
