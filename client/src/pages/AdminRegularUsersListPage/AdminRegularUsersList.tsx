import React from 'react';

import { Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Loader from '../../components/Loader/Loader';
import CustomDropdown from '../../components/CustomDropdown';

import { useContext } from './AdminRegularUsersListContext';

import { formatDateToLocale } from '../../helpers/stringFormatters';

import { USERS_FILTER_OPTIONS } from './constants';

import classes from './AdminRegularUsersList.module.scss';

const AdminRegularUsersList: React.FC = () => {
  const {
    filters,
    loading,
    paginationComponent,
    regularUsersList,
    range,
    handleChangeFailedSyncFilter,
    onClick,
    onExportCsv,
  } = useContext();

  return (
    <div className={classes.tableContainer}>
      <div className="mb-4 d-flex flex-direction-row align-items-center justify-content-between">
        <Button
          className="mr-4 d-flex flex-direction-row align-items-center"
          onClick={onExportCsv}
          disabled={loading}
        >
          <FontAwesomeIcon icon="download" className="mr-2" />{' '}
          {loading ? (
            <>
              <span className="mr-3">Exporting...</span>
              <Loader isWhite hasInheritFontSize />
            </>
          ) : (
            'Export'
          )}
        </Button>

        <div className="d-flex align-items-center">
          Filter Type:&nbsp;
          <CustomDropdown
            value={filters.failedSyncedWithEdge}
            options={USERS_FILTER_OPTIONS}
            onChange={handleChangeFailedSyncFilter}
            isDark
            withoutMarginBottom
            fitContentWidth
            isSmall
            placeholder="All"
          />
        </div>
      </div>
      <Table className="table" striped={true}>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Date</th>
            <th scope="col">User</th>
            <th scope="col">Status</th>
            <th scope="col">Timezone</th>
          </tr>
        </thead>
        <tbody>
          {regularUsersList?.length
            ? regularUsersList.map((regularUser, i) => (
                <tr
                  key={regularUser.id}
                  className={classes.userItem}
                  onClick={() => onClick(regularUser.id)}
                >
                  <th>{range[i]}</th>
                  <th>
                    {regularUser.createdAt
                      ? formatDateToLocale(regularUser.createdAt)
                      : null}
                  </th>
                  <th>{regularUser.email || regularUser.id}</th>
                  <th>{regularUser.status}</th>
                  <th>{regularUser.timeZone}</th>
                </tr>
              ))
            : null}
        </tbody>
      </Table>
      {paginationComponent}
    </div>
  );
};

export default AdminRegularUsersList;
