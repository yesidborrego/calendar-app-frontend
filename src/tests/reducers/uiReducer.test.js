import { uiCloseModal, uiOpenModal } from '../../actions/ui';
import { uiReducer } from '../../reducers/uiReducer';
import { types } from '../../types/types';

import '@testing-library/jest-dom';

const initialState = {
  openModal: false,
};

describe('Pruebas en uiReducer', () => {
  test('Debe retornar el estado por defecto', () => {

    const state = uiReducer(initialState, {});
    expect(state).toEqual(initialState);
  })

  test('Debe abrir y cerrar el modal', () => {
    const openModal = uiOpenModal();
    const stateOpen = uiReducer(initialState, openModal);
    expect(stateOpen).toEqual({openModal: true});

    const closeModal = uiCloseModal();
    const stateClose = uiReducer(stateOpen, closeModal);
    expect(stateClose).toEqual({openModal: false});

  })
})
