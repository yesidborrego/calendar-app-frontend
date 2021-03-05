import { fetchWithoutToken, fetchWithToken } from '../../helpers/fetch';

import '@testing-library/jest-dom';

describe('Pruebas del helper fetch', () => {

  let token = '';

  test('fetchWithoutToken debe funcionar', async () => {
    const res = await fetchWithoutToken('auth', {email: 'yesid@test.com', password: '12345678'}, 'POST');
    expect(res instanceof Response).toBe(true);

    const body = await res.json();
    expect(body.ok).toBe(true);

    token = body.token;
  })
  // events
  test('fetchWithToken debe funcionar', async () => {
    localStorage.setItem('token', token);
    const res = await fetchWithToken('events');
    const body = await res.json();

    expect(body.ok).toBe(true);

  })

});
