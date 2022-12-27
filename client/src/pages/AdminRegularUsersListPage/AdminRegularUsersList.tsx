import React from 'react';

import { Table } from 'react-bootstrap';

import { useContext } from './AdminRegularUsersListContext';

import { formatDateToLocale } from '../../helpers/stringFormatters';

import classes from './AdminRegularUsersList.module.scss';

const AdminRegularUsersList: React.FC = () => {
  const { paginationComponent, regularUsersList, onClick } = useContext();

  return (
    <div className={classes.tableContainer}>
      <Table className="table" striped={true}>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">User</th>
            <th scope="col">Status</th>
            <th scope="col">Timezone</th>
          </tr>
        </thead>
        <tbody>
          {regularUsersList?.length
            ? regularUsersList.map(regularUser => (
                <tr
                  key={regularUser.id}
                  className={classes.userItem}
                  onClick={() => onClick(regularUser.id)}
                >
                  <th>
                    {regularUser.createdAt
                      ? formatDateToLocale(regularUser.createdAt)
                      : null}
                  </th>
                  <th>{regularUser.email}</th>
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
