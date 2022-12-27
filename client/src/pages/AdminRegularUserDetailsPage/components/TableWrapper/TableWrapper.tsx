import React from 'react';

import { Table } from 'react-bootstrap';

import classes from './TableWrapper.module.scss';

type Props = {
  title: string;
};

export const TableWrapper: React.FC<Props> = props => {
  const { title, children } = props;

  return (
    <div className={classes.container}>
      <h5 className={classes.title}>{title}</h5>
      <Table className="table" striped={true}>
        {children}
      </Table>
    </div>
  );
};
