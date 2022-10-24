import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import { ORDER_NUMBER_PARAM_NAME } from '../../../../constants/order';
import { ROUTES } from '../../../../constants/routes';

import { ActionsProps } from '../../types';

import classes from './OrderItemActions.module.scss';

type Props = {
  orderId: string;
  orderNumber: string;
} & ActionsProps;

export const OrderItemActions: React.FC<Props> = props => {
  const { orderId, orderNumber, onDownloadClick, onPrintClick } = props;

  const [pdfLoading, togglePdfLoading] = useState<boolean>(false);

  const handlePrintClick = () => {
    onPrintClick(orderId, orderNumber);
  };

  const handleDownloadClick = () => {
    onDownloadClick({ orderId, orderNumber, togglePdfLoading });
  };

  return (
    <div className={classes.container}>
      <Link
        to={{
          pathname: ROUTES.ORDER_DETAILS,
          search: `${ORDER_NUMBER_PARAM_NAME}=${orderNumber}`,
          state: { orderId },
        }}
        className={classes.link}
      >
        <Button className={classes.button}>VIEW</Button>
      </Link>

      <FontAwesomeIcon
        icon="print"
        className={classes.icon}
        onClick={handlePrintClick}
      />
      <FontAwesomeIcon
        icon={pdfLoading ? 'circle-notch' : 'download'}
        spin={pdfLoading}
        className={classes.icon}
        onClick={handleDownloadClick}
      />
    </div>
  );
};
