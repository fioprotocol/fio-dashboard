import { Component, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ExportToCsv } from 'export-to-csv';

import { getRegularUsersList } from '../../redux/admin/actions';

import { regularUsersList as regularUsersListSelector } from '../../redux/admin/selectors';

import apis from '../../api';

import usePagination from '../../hooks/usePagination';

import { formatDateToLocale } from '../../helpers/stringFormatters';

import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { ADMIN_ROUTES } from '../../constants/routes';

import { User } from '../../types';
import { log } from '../../util/general';

type UseContextProps = {
  loading: boolean;
  paginationComponent: Component;
  regularUsersList: User[];
  range: number[];
  onClick: (regularUserId: string) => void;
  onExportCsv: () => Promise<void>;
};

export const useContext = (): UseContextProps => {
  const regularUsersList = useSelector(regularUsersListSelector);

  const dispatch = useDispatch();

  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);

  const getRegularUsers = useCallback(
    (limit: number, offset: number) =>
      dispatch(getRegularUsersList(limit, offset)),
    [dispatch],
  );

  const { paginationComponent, range } = usePagination(getRegularUsers);

  const onClick = useCallback(
    (regularUserEmail: string) => {
      history.push({
        pathname: ADMIN_ROUTES.ADMIN_REGULAR_USER_DETAILS,
        search: `${QUERY_PARAMS_NAMES.USER_ID}=${regularUserEmail}`,
      });
    },
    [history],
  );

  const onExportCsv = useCallback(async () => {
    setLoading(true);
    const usersList = await apis.admin.usersList(0, 0, true);

    const preparedUsersListToCsv: {
      number: number;
      email: string;
      created: string;
      status: string;
      refProfile: string;
      affiliate: string;
      timeZone: string;
    }[] = [];

    usersList.users?.forEach((user, i) => {
      const {
        email,
        createdAt,
        status,
        refProfile,
        affiliateProfile,
        timeZone,
      } = user;

      preparedUsersListToCsv.push({
        number: i + 1,
        email,
        created: formatDateToLocale(createdAt),
        status,
        refProfile: refProfile?.code || 'No Ref profile',
        affiliate: affiliateProfile?.code || 'No Affiliate',
        timeZone,
      });
    });
    const currentDate = new Date();

    try {
      new ExportToCsv({
        showLabels: true,
        filename: `Users-List_Total-${
          usersList.maxCount
        }_${currentDate.getFullYear()}-${currentDate.getMonth() +
          1}-${currentDate.getDate()}_${currentDate.getHours()}-${currentDate.getMinutes()}`,
        headers: [
          '#',
          'Email',
          'Created',
          'Status',
          'Ref Profile',
          'Affiliate',
          'TimeZone',
        ],
      }).generateCsv(preparedUsersListToCsv);
    } catch (err) {
      log.error(err);
    }

    setLoading(false);
  }, []);

  return {
    loading,
    paginationComponent,
    regularUsersList,
    range,
    onClick,
    onExportCsv,
  };
};
