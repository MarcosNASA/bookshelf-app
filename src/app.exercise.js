/** @jsx jsx */
import {jsx} from '@emotion/core';

import React from 'react';
// 🐨 you're going to need this:
// import * as auth from 'auth-provider'
import * as auth from 'auth-provider';
import {client} from './utils/api-client';
import {AuthenticatedApp} from './authenticated-app';
import {UnauthenticatedApp} from './unauthenticated-app';
import {useAsync} from './utils/hooks';
import {FullPageSpinner} from './components/lib';
import * as colors from './styles/colors';

async function getUser() {
  let user = null;

  const token = await auth.getToken();
  if (token) {
    user = await client('me', {token});
  }

  return user;
}

function App() {
  // 🐨 useState for the user
  const {
    data: user,
    error,
    isIdle,
    isLoading,
    isSuccess,
    isError,
    setData: setUser,
    run,
  } = useAsync();

  const login = form => auth.login(form).then(u => setUser(u));
  const register = form => auth.register(form).then(u => setUser(u));
  const logout = _ => auth.logout().then(_ => setUser(null));

  React.useEffect(() => {
    run(getUser());
  }, [run]);

  if (isLoading || isIdle) {
    return <FullPageSpinner />;
  }

  if (isError) {
    return (
      <div
        css={{
          color: colors.danger,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p>Uh oh... There's a problem. Try refreshing the app.</p>
        <pre>{error.message}</pre>
      </div>
    );
  }

  if (isSuccess) {
    return user ? (
      <AuthenticatedApp user={user} logout={logout} />
    ) : (
      <UnauthenticatedApp login={login} register={register} />
    );
  }

  return <FullPageSpinner />;
}

export {App};

/*
eslint
  no-unused-vars: "off",
*/
