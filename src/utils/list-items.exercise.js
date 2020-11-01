import {useQuery, useMutation, queryCache} from 'react-query';
import {setQueryDataForBook} from 'utils/books';
import {client} from 'utils/api-client';

// - `useListItem(user, bookId)`
// - `useListItems(user)`
// - `useUpdateListItem(user)`
// - `useRemoveListItem(user)`
// - `useCreateListItem(user)`

function useListItems(user) {
  const {data: listItems} = useQuery(
    {
      queryKey: 'list-items',
      queryFn: () =>
        client(`list-items`, {token: user.token}).then(data => data.listItems),
    },
    {
      onSuccess: listItems => {
        for (const listItem of listItems) {
          setQueryDataForBook(listItem.book);
        }
      },
    },
  );
  return listItems ?? [];
}

function useListItem(user, bookId) {
  const listItems = useListItems(user);
  return listItems.find(li => li.bookId === bookId) ?? null;
}

const defaultMutationOptions = {
  onError: (err, variables, recover) => {
    return typeof recover === 'function' ? recover() : null;
  },
  onSettled: () => queryCache.invalidateQueries('list-items'),
};

function useUpdateListItem(user, customOptions) {
  return useMutation(
    updates =>
      client(`list-items/${updates.id}`, {
        method: 'PUT',
        data: updates,
        token: user.token,
      }),
    {
      onMutate(newItem) {
        const previousItems = queryCache.getQueryData('list-items');

        queryCache.setQueryData('list-items', old => {
          return old.map(item => {
            return item.id === newItem.id ? {...item, ...newItem} : item;
          });
        });

        return () => queryCache.setQueryData('list-items', previousItems);
      },
      ...defaultMutationOptions,
      ...customOptions,
    },
  );
}

function useRemoveListItem(user, customOptions) {
  return useMutation(
    ({id}) => client(`list-items/${id}`, {method: 'DELETE', token: user.token}),
    {
      onMutate(removedItem) {
        const previousItems = queryCache.getQueryData('list-items');

        queryCache.setQueryData('list-items', old => {
          return old.filter(item => item.id !== removedItem.id);
        });

        return () => queryCache.setQueryData('list-items', previousItems);
      },
      ...defaultMutationOptions,
      ...customOptions,
    },
  );
}

function useCreateListItem(user, customOptions) {
  return useMutation(
    ({bookId}) => client(`list-items`, {data: {bookId}, token: user.token}),
    {...defaultMutationOptions, ...customOptions},
  );
}

export {
  useListItem,
  useListItems,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
};
