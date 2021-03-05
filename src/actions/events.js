import Swal from "sweetalert2";

import { convertDateEvents } from "../helpers/convertDateEvents";
import { fetchWithToken } from "../helpers/fetch";
import { types } from "../types/types";

export const eventSetActive = (event) => (
  {
    type: types.eventSetActive,
    payload: event
  }
);

export const eventStartAddNew = (event) => {
  return async (dispatch, getState) => {
    const { uid, name } = getState().auth;

    try {
      const res = await fetchWithToken('events', event, 'POST');
      const body = await res.json();

      event.id = body.evento.id;
      event.user = {
        _id: uid,
        name
      };

      dispatch(eventAddNew(event));

    } catch (error) {
      console.error(error);
    }
  }
}

const eventAddNew = (event) => (
  {
    type: types.eventAddNew,
    payload: event
  }
);

export const eventStartUpdate = (event) => {
  return async (dispatch) => {
    try {
      const res = await fetchWithToken(`events/${event.id}`, event, 'PUT');
      const body = await res.json();

      if(body.ok) {
        dispatch(eventUpdated(event));
      } else {
        Swal.fire('Error', body.msg, 'error');
      }

    } catch (error) {
      console.error(error);
    }
  }
}

const eventUpdated = (event) => (
  {
    type: types.eventUpdated,
    payload: event
  }
);

export const eventStartDelete = () => {
  return async (dispatch, getState) => {
    try {
      const { id } = getState().calendar.activeEvent;
      const res = await fetchWithToken(`events/${id}`, {}, 'DELETE');
      const body = await res.json();
      if(body.ok) {
        dispatch(eventDeleted());
      } else {
        Swal.fire('Error', body.msg, 'error');
      }

    } catch (error) {
      console.error(error);
    }
  }
}

const eventDeleted = () => (
  {
    type: types.eventDeleted,
  }
);

export const eventClearActive = () => (
  {
    type: types.eventClearActive,
  }
);

export const eventStartLoad = () => {
  return async (dispatch) => {
    try {
      const res = await fetchWithToken('events');
      const body = await res.json();

      const events = convertDateEvents(body.events);
      dispatch(eventLoaded(events));

    } catch (error) {
      console.log(error);
    }
  }
}

const eventLoaded = (events) => (
  {
    type: types.eventStartLoad,
    payload: events
  }
)

export const eventClearState = () => (
  {
    type: types.eventClearState
  }
)