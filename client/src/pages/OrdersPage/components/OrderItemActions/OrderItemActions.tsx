import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import { ROUTES } from '../../../../constants/routes';

import classes from './OrderItemActions.module.scss';

type Props = {
  id: string;
  onDownloadClick: (id: string) => void;
  onPrintClick: (id: string) => void;
  onViewClick: (id: string) => void;
};

export const OrderItemActions: React.FC<Props> = props => {
  const { id, onDownloadClick, onPrintClick, onViewClick } = props;

  const viewLink = ROUTES.HOME; // todo: set link to order details page

  const handleViewClick = () => {
    onViewClick(id);
  };

  const handlePrintClick = () => {
    onPrintClick(id);
  };

  const handleDownloadClick = () => {
    onDownloadClick(id);
  };

  return (
    <div className={classes.container}>
      <Link to={viewLink} className={classes.link}>
        <Button onClick={handleViewClick} className={classes.button}>
          VIEW
        </Button>
      </Link>

      <FontAwesomeIcon
        icon="print"
        className={classes.icon}
        onClick={handlePrintClick}
      />
      <FontAwesomeIcon
        icon="download"
        className={classes.icon}
        onClick={handleDownloadClick}
      />
    </div>
  );
};
