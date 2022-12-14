import { Component, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ExportToCsv } from 'export-to-csv';

import { getRegularUsersList } from '../../redux/admin/actions';

import { regularUsersList as regularUsersListSelector } from '../../redux/admin/selectors';

import apis from '../../api';

import usePagination from '../../hooks/usePagination';

import { formatDateToLocale } from '../../helpers/stringFormatters';

import { DOMAIN_STATUS } from '../../constants/common';
import { PURCHASE_RESULTS_STATUS_LABELS } from '../../constants/purchase';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { ROUTES } from '../../constants/routes';

import { User } from '../../types';

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
        pathname: ROUTES.ADMIN_REGULAR_USER_DETAILS,
        search: `${QUERY_PARAMS_NAMES.USER_ID}=${regularUserEmail}`,
      });
    },
    [history],
  );

  const onExportCsv = useCallback(async () => {
    setLoading(true);
    const usersList = await apis.admin.usersDetailedList();

    const preparedUsersListToCsv: {
      email?: string;
      created?: string;
      status?: string;
      refProfile?: string;
      affiliate?: string;
      timeZone?: string;
      fioWalletName?: string;
      fioWalletPublicKey?: string;
      fioWaleltBalance?: number | string;
      fioDomainName?: string;
      fioDomainExpiration?: string;
      fioDomainStatus?: string;
      fioDomainWalletName?: string;
      fioAddressName?: string;
      fioAddressBundles?: number | string;
      fioAddressWalletName?: string;
      orderDate?: string;
      orderId?: string;
      orderAmount?: string;
      orderStatus?: string;
    }[] = [];

    usersList.forEach(user => {
      const {
        email,
        createdAt,
        status,
        refProfile,
        affiliateProfile,
        timeZone,
        fioWallets,
        fioDomains,
        fioAddresses,
        orders,
      } = user;

      const commonUserData = {
        email,
        created: formatDateToLocale(createdAt),
        status,
        refProfile: refProfile?.code || 'No Ref profile',
        affiliate: affiliateProfile?.code || 'No Affiliate',
        timeZone,
      };

      const longestArray = [
        fioWallets.length,
        fioDomains.length,
        fioAddresses.length,
        orders.length,
      ].sort((a, b) => b - a);

      for (let i = 0; i < longestArray[0]; i++) {
        const nestedUsersData = {
          fioWalletName: fioWallets[i]?.name || '',
          fioWalletPublicKey: fioWallets[i]?.publicKey || '',
          fioWaleltBalance: fioWallets[i]?.balance || '',
          fioDomainName: fioDomains[i]?.name || '',
          fioDomainExpiration: fioDomains[i]?.expiration
            ? formatDateToLocale(fioDomains[i].expiration.toString())
            : '',
          fioDomainStatus: fioDomains[i]
            ? fioDomains[i].isPublic
              ? DOMAIN_STATUS.PUBLIC
              : DOMAIN_STATUS.PRIVATE
            : '',
          fioDomainWalletName: fioDomains[i]?.walletName || '',
          fioAddressName: fioAddresses[i]?.name || '',
          fioAddressBundles: fioAddresses[i]?.remaining || '',
          fioAddressWalletName: fioAddresses[i]?.walletName || '',
          orderDate: orders[i]?.createdAt
            ? formatDateToLocale(orders[i].createdAt)
            : '',
          orderId: orders[i]?.number || '',
          orderAmount: orders[i]?.total || '',
          orderStatus: orders[i]?.status
            ? PURCHASE_RESULTS_STATUS_LABELS[orders[i].status]
            : '',
        };
        if (i === 0) {
          preparedUsersListToCsv.push({
            ...commonUserData,
            ...nestedUsersData,
          });
        } else {
          preparedUsersListToCsv.push({
            ...nestedUsersData,
            email: '',
            created: '',
            status: '',
            refProfile: '',
            affiliate: '',
            timeZone: '',
          });
        }
      }
    });
    const currentDate = new Date();

    new ExportToCsv({
      showLabels: true,
      filename: `Users-List-${currentDate.getFullYear()}-${currentDate.getMonth() +
        1}-${currentDate.getDate()}-${currentDate.getHours()}-${currentDate.getMinutes()}`,
      headers: [
        'Email',
        'Created',
        'Status',
        'Ref Profile',
        'Affiliate',
        'TimeZone',
        'FIO Wallet Name',
        'FIO Wallet Public Key',
        'FIO Wallet Balance',
        'FIO Domain Name',
        'FIO Domain Expiration',
        'FIO Domain Status',
        'FIO Domain Wallet Name',
        'FIO Address Name',
        'FIO Address Bundles',
        'FIO Address Wallet Name',
        'Order Date',
        'Order ID',
        'Order Amount',
        'Order Status',
      ],
    }).generateCsv(preparedUsersListToCsv);
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
