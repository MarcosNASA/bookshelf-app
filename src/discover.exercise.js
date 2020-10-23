import React from 'react';
/** @jsx jsx */
import {jsx} from '@emotion/core';
import './bootstrap';
import {FaSearch, FaTimes} from 'react-icons/fa';
import * as colors from 'styles/colors';

import Tooltip from '@reach/tooltip';
import {BookRow} from './components/book-row';
import {Input, BookListUL, Spinner} from './components/lib';
// 🐨 import the client from './utils/api-client'
import {client} from './utils/api-client';
import {useAsync} from 'utils/hooks';

function DiscoverBooksScreen() {
  const {data, error, run, isLoading, isError, isSuccess} = useAsync();
  const [query, setQuery] = React.useState('');
  const [queried, setQueried] = React.useState(false);
  React.useEffect(() => {
    if (!queried) {
      return;
    }

    setQueried(false);
    run(client(`books?query=${encodeURIComponent(query)}`));
  }, [queried, run, query]);

  function handleSearchSubmit(event) {
    // 🐨 call preventDefault on the event so you don't get a full page reload
    // 🐨 set the queried state to true
    // 🐨 set the query value which you can get from event.target.elements
    // 💰 console.log(event.target.elements) if you're not sure.
    event.preventDefault();
    setQueried(true);
    setQuery(event.target.elements.search.value);
  }

  return (
    <div
      css={{maxWidth: 800, margin: 'auto', width: '90vw', padding: '40px 0'}}
    >
      <form onSubmit={handleSearchSubmit}>
        <Input
          placeholder="Search books..."
          id="search"
          css={{width: '100%'}}
        />
        <Tooltip label="Search Books">
          <label htmlFor="search">
            <button
              type="submit"
              css={{
                border: '0',
                position: 'relative',
                marginLeft: '-35px',
                background: 'transparent',
              }}
            >
              {isLoading ? (
                <Spinner />
              ) : isError ? (
                <FaTimes aria-label="error" css={{color: colors.danger}} />
              ) : (
                <FaSearch aria-label="search" />
              )}{' '}
            </button>
          </label>
        </Tooltip>
      </form>
      {isError ? (
        <div css={{color: colors.danger}}>
          <p>There was an error:</p>
          <pre>{error.message}</pre>
        </div>
      ) : null}
      {isSuccess ? (
        data?.books?.length ? (
          <BookListUL css={{marginTop: 20}}>
            {data.books.map(book => (
              <li key={book.id}>
                <BookRow key={book.id} book={book} />
              </li>
            ))}
          </BookListUL>
        ) : (
          <p>No books found. Try another search.</p>
        )
      ) : null}
    </div>
  );
}

export {DiscoverBooksScreen};
