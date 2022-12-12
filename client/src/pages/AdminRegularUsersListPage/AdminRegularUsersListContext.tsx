import { Component, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getRegularUsersList } from '../../redux/admin/actions';

import { regularUsersList as regularUsersListSelector } from '../../redux/admin/selectors';

import usePagination from '../../hooks/usePagination';

import { User } from '../../types';

type UseContextProps = {
  paginationComponent: Component;
  regularUsersList: User[];
  onClick: (regularUserId: string) => void;
};

export const useContext = (): UseContextProps => {
  const regularUsersList = useSelector(regularUsersListSelector);

  const dispatch = useDispatch();

  const getRegularUsers = useCallback(
    (limit: number, offset: number) =>
      dispatch(getRegularUsersList(limit, offset)),
    [dispatch],
  );

  const { paginationComponent } = usePagination(getRegularUsers);

  const onClick = (regularUserId: string) => {
    // TODO: open user details modal
  };

  return {
    paginationComponent,
    regularUsersList,
    onClick,
  };
};
