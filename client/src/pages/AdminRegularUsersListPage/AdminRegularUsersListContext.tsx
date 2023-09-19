import { Component, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ExportToCsv } from 'export-to-csv';

import { getRegularUsersList } from '../../redux/admin/actions';

import { regularUsersList as regularUsersListSelector } from '../../redux/admin/selectors';

import apis from '../../api';

import usePagination, { DEFAULT_LIMIT } from '../../hooks/usePagination';

import { formatDateToLocale } from '../../helpers/stringFormatters';

import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { ADMIN_ROUTES } from '../../constants/routes';

import { User } from '../../types';
import { log } from '../../util/general';

type UseContextProps = {
  filters: { failedSyncedWithEdge: string };
  loading: boolean;
  paginationComponent: Component;
  regularUsersList: User[];
  range: number[];
  handleChangeFailedSyncFilter: (newValue: string) => void;
  onClick: (regularUserId: string) => void;
  onExportCsv: () => Promise<void>;
};

export const useContext = (): UseContextProps => {
  const regularUsersList = useSelector(regularUsersListSelector);

  const dispatch = useDispatch();

  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<{ failedSyncedWithEdge: string }>({
    failedSyncedWithEdge: '',
  });

  const getRegularUsers = useCallback(
    (limit: number, offset: number) =>
      dispatch(
        getRegularUsersList({
          limit,
          offset,
          filters,
        }),
      ),
    [dispatch, filters],
  );

  const { paginationComponent, range } = usePagination(
    getRegularUsers,
    DEFAULT_LIMIT,
    filters,
  );

  const onClick = useCallback(
    (regularUserEmail: string) => {
      history.push({
        pathname: ADMIN_ROUTES.ADMIN_REGULAR_USER_DETAILS,
        search: `${QUERY_PARAMS_NAMES.USER_ID}=${regularUserEmail}`,
      });
    },
    [history],
  );

  const handleChangeFailedSyncFilter = useCallback((newValue: string) => {
    setFilters(filters => ({
      ...filters,
      failedSyncedWithEdge: newValue,
    }));
  }, []);

  const onExportCsv = useCallback(async () => {
    setLoading(true);
    const usersList = await apis.admin.usersList({
      limit: 0,
      offset: 0,
      includeMoreDetailedInfo: true,
      filters,
    });

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
  }, [filters]);

  return {
    filters,
    loading,
    paginationComponent,
    regularUsersList,
    range,
    handleChangeFailedSyncFilter,
    onClick,
    onExportCsv,
  };
};
