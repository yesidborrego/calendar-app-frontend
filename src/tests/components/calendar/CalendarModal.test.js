import { act } from '@testing-library/react';
import { mount } from 'enzyme';
import moment from 'moment';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Swal from 'sweetalert2';

import { eventClearActive, eventStartAddNew, eventStartUpdate } from '../../../actions/events';
import { CalendarModal } from '../../../components/calendar/CalendarModal';

jest.mock('../../../actions/events', () => ({
  eventStartUpdate: jest.fn(),
  eventClearActive: jest.fn(),
  eventStartAddNew: jest.fn()
}))

jest.mock('sweetalert2', () => ({
  fire: jest.fn()
}))
const middleware = [thunk];
const mockStore = configureStore(middleware);

const eventStart = moment().minutes(0).seconds(0).add(1, 'hours');
const eventEnd = eventStart.clone().add(1, 'hours');

const initialState = {
  ui: {
    openModal: true
  },
  calendar: {
    events: [],
    activeEvent: {
      end: eventEnd.toDate(),
      notes: 'Test notes',
      start: eventStart.toDate(),
      title: 'Test title',
    }
  },
  auth: {
    uid: 'ABC123',
    name: 'Test'
  }
};

const store = mockStore(initialState);

store.dispatch = jest.fn();

const wrapper = mount(
  <Provider store={ store }>
    <CalendarModal />
  </Provider>
);

describe('Probar el componente <CalendarModal />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  });
  test('Debe mostrar el modal', () => {
    /* expect(wrapper.find('.modal').exists()).toBe(true); // No garantiza el funcionamiento */
    expect(wrapper.find('Modal').prop('isOpen')).toBe(true);
  });

  test('Debe llamar la acción de actualizar y cerrar el modal', () => {
    wrapper.find('form').simulate('submit', {
      preventDefault(){}
    });

    expect(eventStartUpdate).toHaveBeenCalledWith(initialState.calendar.activeEvent);
    expect(eventClearActive).toHaveBeenCalled();
  });

  test('Debe mostrar error si falta el titulo', () => {
    wrapper.find('form').simulate('submit', {
      preventDefault(){}
    });

    expect(wrapper.find('input[name="title"]').hasClass('is-invalid')).toBe(true);
  });

  test('Debe crear un nuevo evento', () => {
    const initialState = {
      ui: {
        openModal: true
      },
      calendar: {
        events: [],
        activeEvent: null
      },
      auth: {
        uid: 'ABC123',
        name: 'Test'
      }
    };
    const store = mockStore(initialState);

    store.dispatch = jest.fn();

    const wrapper = mount(
      <Provider store={ store }>
        <CalendarModal />
      </Provider>
    );

    wrapper.find('input[name="title"]').simulate('change', {
      target: {
        name: 'title',
        value: 'Title test'
      }
    })

    wrapper.find('textarea').simulate('change', {
      target: {
        name: 'notes',
        value: 'Notes test'
      }
    })

    wrapper.find('form').simulate('submit', {
      preventDefault(){}
    });

    expect(eventStartAddNew).toHaveBeenCalledWith(
      {
        end: expect.anything(),
        start: expect.anything(),
        title: 'Title test',
        notes: 'Notes test',
      }
    );

    expect(eventClearActive).toHaveBeenCalled();
  });

  test('Debe validar las fechas', () => {
    wrapper.find('input[name="title"]').simulate('change', {
      target: {
        name: 'title',
        value: 'Title test'
      }
    });

    const hoy = new Date();

    act( () => {
      wrapper.find('DateTimePicker').at(1).prop('onChange')(hoy);
    });

    wrapper.find('form').simulate('submit', {
      preventDefault(){}
    });

    expect(Swal.fire).toHaveBeenCalledWith({"icon": "error", "text": "La fecha y hora fin debe ser mayor a la de inicio!", "title": "Oops..."});
  })

});
