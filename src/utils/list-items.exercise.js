import {useQuery, useMutation, queryCache} from 'react-query';
import {client} from 'utils/api-client';

// - `useListItem(user, bookId)`
// - `useListItems(user)`
// - `useUpdateListItem(user)`
// - `useRemoveListItem(user)`
// - `useCreateListItem(user)`

function useListItem(user, bookId) {
  const listItems = useListItems(user);
  return listItems.find(li => li.bookId === bookId) ?? null;
}

function useListItems(user) {
  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client(`list-items`, {token: user.token}).then(data => data.listItems),
  });
  return listItems ?? [];
}

const defaultMutationOptions = {
  onSettled: () => queryCache.invalidateQueries('list-items'),
};

function useUpdateListItem(user) {
  return useMutation(
    updates =>
      client(`list-items/${updates.id}`, {
        method: 'PUT',
        data: updates,
        token: user.token,
      }),
    defaultMutationOptions,
  );
}

function useRemoveListItem(user) {
  const result = useMutation(
    ({id}) => client(`list-items/${id}`, {method: 'DELETE', token: user.token}),
    defaultMutationOptions,
  );

  return result;
}

function useCreateListItem(user) {
  return useMutation(
    ({bookId}) => client(`list-items`, {data: {bookId}, token: user.token}),
    defaultMutationOptions,
  );
}

export {
  useListItem,
  useListItems,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
};
