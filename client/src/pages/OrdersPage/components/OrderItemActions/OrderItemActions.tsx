import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import { ORDER_NUMBER_PARAM_NAME } from '../../../../constants/order';
import { ROUTES } from '../../../../constants/routes';

import { ActionsProps, HideButtonsProps } from '../../types';

import classes from './OrderItemActions.module.scss';

type Props = {
  orderId: string;
  orderNumber: string;
} & ActionsProps &
  HideButtonsProps;

const PrintButton: React.FC<{ hide: boolean; onClick: () => void }> = ({
  hide,
  onClick,
}) => {
  if (hide) return null;

  return (
    <FontAwesomeIcon icon="print" className={classes.icon} onClick={onClick} />
  );
};

const DownloadPdfButton: React.FC<{
  hide: boolean;
  loading: boolean;
  onClick: () => void;
}> = ({ hide, loading, onClick }) => {
  if (hide) return null;

  return (
    <FontAwesomeIcon
      icon={loading ? 'circle-notch' : 'download'}
      spin={loading}
      className={classes.icon}
      onClick={onClick}
    />
  );
};

export const OrderItemActions: React.FC<Props> = props => {
  const {
    hidePrintButton,
    hidePdfButton,
    orderId,
    orderNumber,
    onDownloadClick,
    onPrintClick,
  } = props;

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

      <PrintButton hide={hidePrintButton} onClick={handlePrintClick} />
      <DownloadPdfButton
        hide={hidePdfButton}
        loading={pdfLoading}
        onClick={handleDownloadClick}
      />
    </div>
  );
};
