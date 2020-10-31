// - `useBook(bookId, user)`
// - `useBookSearch(query, user)`
import {useQuery} from 'react-query';
import {client} from 'utils/api-client';

function useBook(bookId, user) {
  const {data} = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () =>
      client(`books/${bookId}`, {token: user.token}).then(data => data.book),
  });

  return data;
}

function useBookSearch(bookId, user) {
  const result = useQuery({
    queryKey: ['bookSearch', {bookId}],
    queryFn: client(`books?query=${encodeURIComponent(bookId)}`, {
      token: user.token,
    }).then(data => data.books),
  });

  return {
    ...result,
    books: result.data,
  };
}

export {useBook, useBookSearch};
