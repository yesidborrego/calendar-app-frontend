import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, BrowserRouter as Router, Switch } from 'react-router-dom';

import { startTokenRenew } from '../actions/auth';
import { LoginScreen } from '../components/auth/LoginScreen';
import { CalendarScreen } from '../components/calendar/CalendarScreen';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';

export const AppRouter = () => {
  const dispatch = useDispatch();
  const { checking, uid } = useSelector(state => state.auth)

  useEffect(() => {
    dispatch(startTokenRenew());
  }, [dispatch]);

  if(checking) return (<h3>wait...</h3>);

  return (
    <Router>
      <div>
        <Switch>
          <PublicRoute
            exact
            path="/login"
            component={LoginScreen}
            isLogged={ !!uid }
          />
          <PrivateRoute
            exact
            path="/"
            component={CalendarScreen}
            isLogged={ !!uid }
          />

          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  )
}
