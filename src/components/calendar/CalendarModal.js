import moment from 'moment';
import React, { useEffect, useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2'

import { eventClearActive, eventStartAddNew, eventStartUpdate } from '../../actions/events';
import { uiCloseModal } from '../../actions/ui';

const customStyles = {
  content : {
    top         : '50%',
    left        : '50%',
    right       : 'auto',
    bottom      : 'auto',
    marginRight : '-50%',
    transform   : 'translate(-50%, -50%)'
  }
};

const eventStart = moment().minutes(0).seconds(0).add(1, 'hours');
const eventEnd = eventStart.clone().add(1, 'hours');

if(process.env.NODE_ENV !== 'test') {
  Modal.setAppElement('#root')
}

const initEvent = {
  title: '',
  notes: '',
  start: eventStart.toDate(),
  end: eventEnd.toDate()
};

export const CalendarModal = () => {
  const dispatch = useDispatch();
  const [dateStart, setDateStart] = useState(eventStart.toDate());
  const [dateEnd, setDateEnd] = useState(eventEnd.toDate());
  const [formValues, setFormValues] = useState(initEvent);
  const [validTitle, setValidTitle] = useState(true);
  const { openModal } = useSelector(state => state.ui);
  const { activeEvent } = useSelector(state => state.calendar);

  const { title, notes, start, end } = formValues;

  const handleInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value
    });
  }

  const closeModal = () => {
    dispatch(uiCloseModal());
    setFormValues(initEvent);
    dispatch(eventClearActive());
  };

  const handleStartDateChange = (e) => {
    setDateStart(e);
    setFormValues({
      ...formValues,
      start: e
    });
  }

  const handleEndDateChange = (e) => {
    setDateEnd(e);
    setFormValues({
      ...formValues,
      end: e
    });
  }

  const handleSubmitForm = (e) => {
    e.preventDefault();

    const momentStart = moment(start);
    const momentEnd = moment(end);

    if(momentStart.isSameOrAfter(momentEnd)) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'La fecha y hora fin debe ser mayor a la de inicio!',
      })
    }
    if(title.trim().length <= 3) {
      return setValidTitle(false);
    }
    setValidTitle(true);

    if(activeEvent) {
      dispatch(eventStartUpdate(formValues));
    } else {
      dispatch(eventStartAddNew(formValues));
    }


    closeModal();
  }

  useEffect(() => {
    if(activeEvent) {
      setFormValues(activeEvent);
    } else {
      setFormValues(initEvent);
    }
  }, [activeEvent, setFormValues]);

  return (
    <Modal
      isOpen={ openModal }
      onRequestClose={ closeModal }
      style={ customStyles }
      closeTimeoutMS={ 200 }
      className="modal"
      overlayClassName="modal-fondo"
      ariaHideApp={!process.env.NODE_ENV === 'test'}
    >
      <h1>
        {
          (activeEvent) ? 'Editar evento' : 'Nuevo evento'
        }
      </h1>
      <hr />
      <form
        className="container"
        onSubmit={ handleSubmitForm }
      >
          <div className="form-group">
              <label>Fecha y hora inicio</label>
              <DateTimePicker
                onChange={ handleStartDateChange }
                value={ dateStart }
                className="form-control"
              />
          </div>

          <div className="form-group">
              <label>Fecha y hora fin</label>
              <DateTimePicker
                onChange={ handleEndDateChange }
                value={ dateEnd }
                className="form-control"
                minDate={ dateStart }
              />
          </div>

          <hr />
          <div className="form-group">
              <label>Titulo y notas</label>
              <input
                  type="text"
                  className={`form-control ${!validTitle ? 'is-invalid' : 'is-valid'}`}
                  placeholder="Título del evento"
                  name="title"
                  autoComplete="off"
                  value={ title }
                  onChange={ handleInputChange }
              />
              <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
          </div>

          <div className="form-group">
              <textarea
                  type="text"
                  className="form-control"
                  placeholder="Notas"
                  rows="5"
                  name="notes"
                  value={ notes }
                  onChange={ handleInputChange }
              ></textarea>
              <small id="emailHelp" className="form-text text-muted">Información adicional</small>
          </div>

          <button
              type="submit"
              className="btn btn-outline-primary btn-block"
          >
              <i className="far fa-save"></i>
              <span> Guardar</span>
          </button>
      </form>
    </Modal>
  )
}
