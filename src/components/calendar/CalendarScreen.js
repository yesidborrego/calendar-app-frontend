import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import { useDispatch, useSelector } from 'react-redux';

import { eventClearActive, eventSetActive, eventStartLoad } from '../../actions/events';
import { uiOpenModal } from '../../actions/ui';
import { calendarLangEs } from '../../helpers/calendar-lang-es';
import { AddNewFab } from '../ui/AddNewFab';
import { DeleteEventFab } from '../ui/DeleteEventFab';
import { Navbar } from '../ui/Navbar'
import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';

import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.locale('es');
const localizer = momentLocalizer(moment);

export const CalendarScreen = () => {
  const dispatch = useDispatch();
  const { uid } = useSelector(state => state.auth)

  const { events, activeEvent } = useSelector(state => state.calendar);

  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month');

  const dobleClickEvent = (e) => {
    dispatch(uiOpenModal());
  }

  const selectedEvent = (e) => {
    dispatch(eventSetActive(e));
  }

  const viewChange = (e) => {
    setLastView(e);
    localStorage.setItem('lastView', e);
  }

  const onSelectedSlot = (e) => {
    dispatch(eventClearActive());
  }

  useEffect(() => {
    dispatch(eventStartLoad());
  }, [dispatch])

  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: (uid === event.user._id) ? '#367CF7' : '#465660',
      borderRadius: '0px',
      opacity: '0.8',
      color: 'white',
      display: 'block'
    }
    return {style};
  }
  return (
    <div className="calendar-screen">
      <Navbar/>
      <h1>CalendarScreen</h1>
      <Calendar
        localizer={ localizer }
        events={ events }
        startAccessor="start"
        endAccessor="end"
        messages={ calendarLangEs }
        eventPropGetter={ eventStyleGetter }
        onDoubleClickEvent={ dobleClickEvent }
        onSelectEvent={ selectedEvent }
        onSelectSlot={ onSelectedSlot }
        selectable={ true }
        onView={ viewChange }
        view={ lastView }
        components={{ event: CalendarEvent }}
      />

      <CalendarModal/>

      {
        activeEvent && <DeleteEventFab />
      }

      <AddNewFab />
    </div>
  )
}
