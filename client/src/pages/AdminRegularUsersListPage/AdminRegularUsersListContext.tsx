import { Component, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { getRegularUsersList } from '../../redux/admin/actions';

import { regularUsersList as regularUsersListSelector } from '../../redux/admin/selectors';

import usePagination from '../../hooks/usePagination';

import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { ROUTES } from '../../constants/routes';

import { User } from '../../types';

type UseContextProps = {
  paginationComponent: Component;
  regularUsersList: User[];
  onClick: (regularUserId: string) => void;
};

export const useContext = (): UseContextProps => {
  const regularUsersList = useSelector(regularUsersListSelector);

  const dispatch = useDispatch();

  const history = useHistory();

  const getRegularUsers = useCallback(
    (limit: number, offset: number) =>
      dispatch(getRegularUsersList(limit, offset)),
    [dispatch],
  );

  const { paginationComponent } = usePagination(getRegularUsers);

  const onClick = (regularUserEmail: string) => {
    history.push({
      pathname: ROUTES.ADMIN_REGULAR_USER_DETAIS,
      search: `${QUERY_PARAMS_NAMES.USER_ID}=${regularUserEmail}`,
    });
  };

  return {
    paginationComponent,
    regularUsersList,
    onClick,
  };
};
