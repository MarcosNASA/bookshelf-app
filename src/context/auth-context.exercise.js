// 🐨 create and export a React context variable for the AuthContext
// 💰 using React.createContext
import * as React from 'react';
import * as auth from 'auth-provider';
import {FullPageSpinner, FullPageErrorFallback} from '../components/lib';
import {client} from '../utils/api-client';
import {useAsync} from '../utils/hooks';

const AuthContext = React.createContext();

function AuthProvider(props) {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync();

  React.useEffect(() => {
    run(getUser());
  }, [run]);

  const login = form => auth.login(form).then(user => setData(user));
  const register = form => auth.register(form).then(user => setData(user));
  const logout = () => {
    auth.logout();
    setData(null);
  };

  if (isLoading || isIdle) {
    return <FullPageSpinner />;
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

  if (isSuccess) {
    return (
      <AuthContext.Provider
        value={{user, login, register, logout}}
        {...props}
      />
    );
  }
}

function useAuth() {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be called within an AuthProvider');
  }

  return context;
}

function useClient() {
  const {
    user: {token},
  } = useAuth();

  return React.useCallback(
    function authenticatedClient(endpoint, config) {
      return client(endpoint, {...config, token});
    },
    [token],
  );
}
async function getUser() {
  let user = null;

  const token = await auth.getToken();
  if (token) {
    const data = await client('me', {token});
    user = data.user;
  }

  return user;
}

export {AuthProvider, useAuth, useClient};
