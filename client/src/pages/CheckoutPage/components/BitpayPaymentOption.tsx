import React, { useCallback, useEffect, useState } from 'react';

import { BitPayButton } from '../../../components/BitPayButton';

import { setFioName } from '../../../utils';

import {
  PAYMENT_PROVIDER,
  PURCHASE_RESULTS_STATUS,
} from '../../../constants/purchase';
import {
  ANALYTICS_EVENT_ACTIONS,
  CURRENCY_CODES,
  WALLET_CREATED_FROM,
} from '../../../constants/common';
import { DOMAIN_TYPE } from '../../../constants/fio';

import {
  fireAnalyticsEvent,
  getCartItemsDataForAnalytics,
} from '../../../util/analytics';
import { actionFromCartItem } from '../../../util/cart';

import { BeforeSubmitData, BitPayOptionProps } from '../types';
import { CartItem, ClickEventTypes } from '../../../types';

const BITPAY_ORIGIN = 'bitpay';
const BITPAY_ORIGIN_REGEX = new RegExp(BITPAY_ORIGIN, 'i');

export const BitpayPaymentOption: React.FC<BitPayOptionProps> = props => {
  const {
    displayOrderItems,
    order,
    payment,
    paymentOption,
    paymentWallet,
    beforePaymentSubmit,
  } = props;

  const bitPayInvoiceId = order?.payment?.externalPaymentId;

  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [isLoadingBitPay, setIsLoadingBitPay] = useState<boolean>(false);
  const [submitData, setSubmitData] = useState<BeforeSubmitData>(null);

  const onFinish = useCallback(
    (beforeSubmitData: BeforeSubmitData) => {
      props.onFinish({
        errors: [],
        registered: displayOrderItems.map(
          ({
            id,
            address,
            domain,
            isFree,
            costNativeFio,
            type,
            domainType,
          }: CartItem) => ({
            action: actionFromCartItem(
              type,
              (paymentWallet?.from === WALLET_CREATED_FROM.EDGE ||
                paymentWallet?.from === WALLET_CREATED_FROM.METAMASK) &&
                domainType === DOMAIN_TYPE.CUSTOM,
            ),
            fioName: setFioName(address, domain),
            isFree,
            fee_collected: costNativeFio,
            cartItemId: id,
            transaction_id: '',
            data: beforeSubmitData?.[setFioName(address, domain)],
          }),
        ),
        partial: [],
        providerTxId: payment.externalPaymentId,
        paymentProvider: PAYMENT_PROVIDER.BITPAY,
        paymentOption,
        paymentAmount: payment.amount,
        paymentCurrency: CURRENCY_CODES.USD,
        convertedPaymentCurrency: CURRENCY_CODES.FIO,
        providerTxStatus: PURCHASE_RESULTS_STATUS.PAYMENT_PENDING,
      });
    },
    [
      displayOrderItems,
      payment.amount,
      payment.externalPaymentId,
      paymentOption,
      paymentWallet?.from,
      props.onFinish,
    ],
  );

  const handleSubmit = useCallback(
    async (beforeSubmitData?: BeforeSubmitData) => {
      setIsLoadingBitPay(true);
      beforeSubmitData && setSubmitData(beforeSubmitData);
      if (bitPayInvoiceId && window.bitpay) {
        if (process.env.REACT_APP_IS_BITPAY_TEST_ENV) {
          window.bitpay.enableTestMode();
        }

        fireAnalyticsEvent(
          ANALYTICS_EVENT_ACTIONS.PURCHASE_STARTED,
          getCartItemsDataForAnalytics(displayOrderItems),
        );

        window.bitpay.showInvoice(bitPayInvoiceId, {});
      }
    },
    [bitPayInvoiceId, displayOrderItems],
  );

  const onSubmit = async (event: ClickEventTypes) => {
    event.preventDefault();
    if (submitData) {
      await handleSubmit();
    } else {
      await beforePaymentSubmit(handleSubmit);
    }
  };

  const handleBitPayPaymentMessage = useCallback(event => {
    const payment_status = event.data.status;

    if (BITPAY_ORIGIN_REGEX.test(event.origin)) {
      setIsPaid(payment_status === 'paid' || payment_status === 'confirmed');
    }
  }, []);

  const onBitPayModalClose = useCallback(() => {
    window.bitpay?.onModalWillEnter(function() {
      setIsLoadingBitPay(false);
    });
  }, []);

  useEffect(() => {
    onBitPayModalClose();
  }, [onBitPayModalClose]);

  useEffect(() => {
    if (isPaid) {
      onFinish(submitData);
      setIsPaid(false);
    }
  }, [isPaid, onFinish, submitData]);

  useEffect(() => {
    window.addEventListener('message', handleBitPayPaymentMessage);
    return () => {
      window.removeEventListener('message', handleBitPayPaymentMessage);
      const bitpayIframe = document.getElementsByName('bitpay');
      window.bitpay && bitpayIframe.length > 0 && window.bitpay.hideFrame();
    };
  }, [handleBitPayPaymentMessage]);

  return (
    <div className="d-flex justify-content-center">
      <BitPayButton
        onClick={onSubmit}
        loading={isLoadingBitPay}
        disabled={isLoadingBitPay}
      />
    </div>
  );
};
