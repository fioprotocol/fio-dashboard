import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import AvailableDomains from './components/AvailableDomains';
import DashboardDomains from './components/DashboardDomains';
import UsernamesOnCustomDomains from './components/UsernamesOnCustomDomains';
import SearchPrefixes from './components/SearchPrefixes';
import SearchPostfixes from './components/SearchPostfixes';
import MaintenanceSwitch from './components/MaintenanceSwitch';
import OutboundSwitch from './components/OutboundSwitch';
import { FormsOfPayment } from './components/FormsOfPayment';
import { MockedPublicKeyForBoardOfDirectors } from './components/MockedPublicKeyForBoardOfDirectors';
import { VoteFioHandle } from './components/VoteFioHandle';

import api from '../../admin/api';
import apis from '../../api';

import { VARS_KEYS } from '../../constants/vars';

import { log } from '../../util/general';

import { AdminDefaults, AdminDomain, VarsResponse } from '../../api/responses';

import classes from './styles/AdminDefaultsPage.module.scss';

const AdminDefaultsPage: React.FC = () => {
  const [defaults, setDefaults] = useState<AdminDefaults>();
  const [voteFioHandle, setVoteFioHandle] = useState<string>('');
  const [mockedPublicKey, setMockedPublicKey] = useState<string>('');

  const fetchDefaults = useCallback(async () => {
    const response = await api.admin.getDefaults();
    setDefaults(response);
    apis.vars.getVar(VARS_KEYS.VOTE_FIO_HANDLE).then((data: VarsResponse) => {
      setVoteFioHandle(data.value);
    });
    apis.vars
      .getVar(VARS_KEYS.MOCKED_PUBLIC_KEYS_FOR_BOARD_VOTE)
      .then((data: VarsResponse) => {
        setMockedPublicKey(data.value);
      });
  }, []);

  useEffect(() => {
    fetchDefaults();
  }, [fetchDefaults]);

  const handleSubmit = useCallback(
    async values => {
      if (values.dashboardDomains) {
        const domainsPromises = values.dashboardDomains?.map(
          async (domainItem: AdminDomain) => {
            try {
              const { expiration } =
                (await api.fio.getFioDomain(domainItem.name)) || {};

              domainItem.expirationDate = expiration;
            } catch (error) {
              log.error('Handle settings domain expiration error:', error);
            }
            return domainItem;
          },
        );
        values.dashboardDomains = await Promise.all(domainsPromises);
      }

      await api.admin.saveDefaults({
        ...values,
        mockedPublicKey: values.mockedPublicKey || '',
      });
      await fetchDefaults();
    },
    [fetchDefaults],
  );

  return (
    <div className={classes.container}>
      <Form
        mutators={{ ...arrayMutators }}
        initialValues={{
          availableDomains: defaults?.availableDomains || [],
          dashboardDomains: defaults?.dashboardDomains || [],
          usernamesOnCustomDomains: defaults?.usernamesOnCustomDomains || [],
          searchPrefixes: defaults?.searchPrefixes || [],
          searchPostfixes: defaults?.searchPostfixes || [],
          voteFioHandle: voteFioHandle || '',
          mockedPublicKey: mockedPublicKey || '',
        }}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, submitting, form }) => (
          <>
            <MaintenanceSwitch />
            <OutboundSwitch />
            <FormsOfPayment />
            <VoteFioHandle />
            <MockedPublicKeyForBoardOfDirectors />
            <AvailableDomains form={form} />
            <DashboardDomains form={form} />
            <UsernamesOnCustomDomains form={form} />
            <SearchPrefixes form={form} />
            <SearchPostfixes form={form} />
            <div className={classes.footer}>
              <Button
                disabled={submitting}
                type="button"
                variant="dark"
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                type="submit"
                disabled={submitting}
                variant="primary"
              >
                {submitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  );
};

export default AdminDefaultsPage;
