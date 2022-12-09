import React, { useCallback, useEffect, useState } from 'react';

import { useHistory } from 'react-router';

import { BitPayButton } from '../../../components/BitPayButton';

import { QUERY_PARAMS_NAMES } from '../../../constants/queryParams';
import { ROUTES } from '../../../constants/routes';

import { BitPayOptionProps } from '../types';

export const BitpayPaymentOption: React.FC<BitPayOptionProps> = props => {
  const { order } = props;
  const history = useHistory();

  const bitPayInvoiceId = order?.payment?.externalPaymentId;

  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [isLoadingBitPay, setIsLoadingBitPay] = useState<boolean>(false);

  const payWithBitPay = useCallback(() => {
    setIsLoadingBitPay(true);
    if (bitPayInvoiceId && window.bitpay) {
      if (process.env.REACT_APP_IS_BITPAY_TEST_ENV) {
        window.bitpay.enableTestMode();
      }

      window.bitpay.showInvoice(bitPayInvoiceId);
    }
  }, [bitPayInvoiceId]);

  const handleBitPayPaymentMessage = useCallback(event => {
    const payment_status = event.data.status;
    setIsPaid(payment_status === 'paid');
  }, []);

  const onBitPayModalClose = useCallback(() => {
    window.bitpay.onModalWillLeave(function() {
      if (isPaid) {
        history.push(
          {
            pathname: ROUTES.PURCHASE,
            search: `${QUERY_PARAMS_NAMES.ORDER_NUMBER}=${order.number}`,
          },
          {
            orderId: order.id,
          },
        );
      }
    });
    window.bitpay.onModalWillEnter(function() {
      setIsLoadingBitPay(false);
    });
  }, [history, order.id, order.number, isPaid]);

  useEffect(() => {
    onBitPayModalClose();
  }, [onBitPayModalClose]);

  useEffect(() => {
    window.addEventListener('message', handleBitPayPaymentMessage);
    return () => {
      window.removeEventListener('message', handleBitPayPaymentMessage);
    };
  }, [handleBitPayPaymentMessage]);

  return (
    <div className="d-flex justify-content-center">
      <BitPayButton
        onClick={payWithBitPay}
        loading={isLoadingBitPay}
        disabled={isLoadingBitPay}
      />
    </div>
  );
};
