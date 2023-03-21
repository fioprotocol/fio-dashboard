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

import api from '../../api';

import { AdminDefaults } from '../../api/responses';

import classes from './styles/AdminDefaultsPage.module.scss';

const AdminDefaultsPage: React.FC = () => {
  const [defaults, setDefaults] = useState<AdminDefaults>();

  const fetchDefaults = useCallback(async () => {
    const response = await api.admin.getDefaults();
    setDefaults(response);
  }, []);

  useEffect(() => {
    fetchDefaults();
  }, [fetchDefaults]);

  const handleSubmit = useCallback(async values => {
    await api.admin.saveDefaults(values);
    await fetchDefaults();
  }, []);

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
        }}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, submitting, form }) => (
          <>
            <MaintenanceSwitch />
            <OutboundSwitch />
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
