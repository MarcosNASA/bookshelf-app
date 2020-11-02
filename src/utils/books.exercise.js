// 🐨 we're going to use React hooks in here now so we'll need React
import * as React from 'react';
import {useQuery, queryCache} from 'react-query';
// 🐨 get AuthContext from ./context/auth-context
import {useClient} from '../context/auth-context';
import bookPlaceholderSvg from 'assets/book-placeholder.svg';

const loadingBook = {
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
};

const loadingBooks = Array.from({length: 10}, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
}));

// 🦉 note that this is *not* treated as a hook and is instead called by other hooks
// So we'll continue to accept the user here.
const getBookSearchConfig = (query, client) => ({
  queryKey: ['bookSearch', {query}],
  queryFn: () =>
    client(`books?query=${encodeURIComponent(query)}`, {}).then(
      data => data.books,
    ),
  config: {
    onSuccess(books) {
      for (const book of books) {
        setQueryDataForBook(book);
      }
    },
  },
});

// 💣 remove the user argument here
function useBookSearch(query /*, user*/) {
  // 🐨 get the user from React.useContext(AuthContext)
  const client = useClient();
  const result = useQuery(getBookSearchConfig(query, client));
  return {...result, books: result.data ?? loadingBooks};
}

// 💣 remove the user argument here
function useBook(bookId /*, user*/) {
  // 🐨 get the user from React.useContext(AuthContext)
  const client = useClient();
  const {data} = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () => client(`books/${bookId}`).then(data => data.book),
  });
  return data ?? loadingBook;
}

// we don't want to accept the user here anymore. Instead we'll make a new
// hook that gets the user and then returns this function
// (memoized with React.useCallback)
// 🐨 create a useRefetchBookSearchQuery hook here which:
// 1. Gets the user from the AuthContext
// 2. Returns a memoized callback (React.useCallback) version of this
// refetchBookSearchQuery function. It should no longer need to accept user as
// an argument and instead lists it as a dependency.
function useRefetchBookSearchQuery() {
  const client = useClient();
  return React.useCallback(
    async function refetchBookSearchQuery(/* user */) {
      queryCache.removeQueries('bookSearch');
      await queryCache.prefetchQuery(getBookSearchConfig('', client));
    },
    [client],
  );
}

const bookQueryConfig = {
  staleTime: 1000 * 60 * 60,
  cacheTime: 1000 * 60 * 60,
};

function setQueryDataForBook(book) {
  queryCache.setQueryData({
    queryKey: ['book', {bookId: book.id}],
    queryFn: book,
    ...bookQueryConfig,
  });
}

export {useBook, useBookSearch, useRefetchBookSearchQuery, setQueryDataForBook};
