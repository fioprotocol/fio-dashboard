import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import PrintIcon from '@mui/icons-material/Print';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import Loader from '../../../../components/Loader/Loader';

import { ORDER_NUMBER_PARAM_NAME } from '../../../../constants/order';
import { ROUTES } from '../../../../constants/routes';

import { ActionsProps, HideButtonsProps } from '../../types';

import classes from './OrderItemActions.module.scss';

type Props = {
  orderId: string;
  orderNumber: string;
} & ActionsProps &
  HideButtonsProps;

export const OrderItemActions: React.FC<Props> = props => {
  const {
    disablePrintButton,
    disablePdfButton,
    orderId,
    orderNumber,
    onDownloadClick,
    onPrintClick,
  } = props;

  const [pdfLoading, togglePdfLoading] = useState<boolean>(false);

  const handlePrintClick = () => {
    if (disablePrintButton) return;

    onPrintClick(orderId, orderNumber);
  };

  const handleDownloadClick = () => {
    if (disablePdfButton) return;

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
      <PrintIcon
        className={classnames(
          classes.icon,
          disablePrintButton && classes.disabledButton,
        )}
        onClick={handlePrintClick}
      />
      {pdfLoading ? (
        <Loader className={classes.loader} />
      ) : (
        <FileDownloadIcon
          className={classnames(
            classes.icon,
            disablePdfButton && classes.disabledButton,
          )}
          onClick={handleDownloadClick}
        />
      )}
    </div>
  );
};
