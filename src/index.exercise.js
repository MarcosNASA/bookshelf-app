import {loadDevTools} from './dev-tools/load';
import {ReactQueryConfigProvider} from 'react-query';
import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './app';

const queryConfig = {
  queries: {
    useErrorBoundary: true,
    refetchOnWindowFocus: false,
    retry: 2,
  },
};

loadDevTools(() => {
  ReactDOM.render(
    <ReactQueryConfigProvider config={queryConfig}>
      <App />
    </ReactQueryConfigProvider>,
    document.getElementById('root'),
  );
});
