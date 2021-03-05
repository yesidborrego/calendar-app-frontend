import { types } from "../../types/types";

describe('Probar el archivo types', () => {
  test('Debe mostrar los datos correctamnete', () => {
    expect(types).toEqual(
      {
        uiOpenModal: '[ui] Open modal',
        uiCloseModal: '[ui] Close modal',

        eventSetActive: '[event] Set active',
        eventClearActive: '[event] Clear event active',
        eventStartAddNew: '[event] Start add new event',
        eventAddNew: '[event] Add new',
        eventUpdated: '[event] Updated event',
        eventDeleted: '[event] Deleted event',
        eventStartLoad: '[event] Start load events',
        eventClearState: '[event] Clear state',

        authCheckingFinish: '[auth] Finish checking login state',
        authStartLogin: '[auth] Start login',
        authLogin: '[auth] Login',
        authStartRegister: '[auth] Start register',
        authStartTokenRenew: '[auth] Start token renew',
        authLogout: '[auth] Logout',
      }
    );
  })

});
