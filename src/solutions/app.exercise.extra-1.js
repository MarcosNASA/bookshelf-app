/** @jsx jsx */
import {jsx} from '@emotion/core';

import React from 'react';
// 🐨 you're going to need this:
// import * as auth from 'auth-provider'
import * as auth from 'auth-provider';
import {client} from './utils/api-client';
import {AuthenticatedApp} from './authenticated-app';
import {UnauthenticatedApp} from './unauthenticated-app';

async function getUser() {
  let user = null;

  const token = await auth.getToken();
  if (token) {
    user = await client('me', {headers: {Authorization: `Bearer ${token}`}});
  }

  return user;
}

function App() {
  // 🐨 useState for the user
  const [user, setUser] = React.useState(null);

  // 🐨 create a login function that calls auth.login then sets the user
  // 💰 const login = form => auth.login(form).then(u => setUser(u))
  const login = form => auth.login(form).then(u => setUser(u));
  // 🐨 create a registration function that does the same as login except for register
  const register = form => auth.register(form).then(u => setUser(u));
  // 🐨 create a logout function that calls auth.logout() and sets the user to null
  const logout = _ => auth.logout().then(_ => setUser(null));
  // 🐨 if there's a user, then render then AuthenitcatedApp with the user and logout
  // 🐨 if there's not a user, then render the UnauthenticatedApp with login and register
  // return <UnauthenticatedApp />

  React.useEffect(() => {
    getUser().then(user => {
      setUser(user);
    });
  }, [setUser]);

  return user ? (
    <AuthenticatedApp user={user} logout={logout} />
  ) : (
    <UnauthenticatedApp login={login} register={register} />
  );
}

export {App};

/*
eslint
  no-unused-vars: "off",
*/
