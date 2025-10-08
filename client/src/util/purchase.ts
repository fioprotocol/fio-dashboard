import { GenericAction } from '@fioprotocol/fiosdk';

import MathOp from './math';
import apis from '../api';
import { renderFioPriceFromSuf } from '../util/fio';

import { OrderItem, OrderItemPdf } from '../types';

export const transformOrderItems = (items: OrderItem[]): OrderItem[] => {
  const orderItems: OrderItem[] = [];

  items.forEach(item => {
    if (item.data?.hasCustomDomain) {
      const customDomainItem = {
        ...item,
        id: `customDomain_${item.id}`,
        action: GenericAction.registerFioDomain,
        address: '',
        nativeFio: item.data.hasCustomDomainFee,
        price: apis.fio.convertFioToUsdc(
          item.data.hasCustomDomainFee,
          item.order.roe,
        ),
        feeCollected: renderFioPriceFromSuf(item.data.hasCustomDomainFee || 0),
      };

      orderItems.push(customDomainItem);

      orderItems.push({
        ...item,
        nativeFio: new MathOp(item.nativeFio)
          .sub(item.data.hasCustomDomainFee)
          .toString(),
        price: apis.fio.convertFioToUsdc(
          new MathOp(item.nativeFio)
            .sub(item.data.hasCustomDomainFee)
            .toString(),
          item.order.roe,
        ),
        feeCollected: renderFioPriceFromSuf(
          (item.blockchainTransactions?.find(
            ({ action }) => action === GenericAction.registerFioDomain,
          )
            ? item.blockchainTransactions.find(
                ({ action }) => action === GenericAction.registerFioAddress,
              )?.feeCollected
            : new MathOp(item.blockchainTransactions?.[0]?.feeCollected)
                .sub(item.data.hasCustomDomainFee)
                .toString()) || 0,
        ),
      });
    } else {
      orderItems.push({
        ...item,
        feeCollected: renderFioPriceFromSuf(
          item.blockchainTransactions?.[0]?.feeCollected || 0,
        ),
      });
    }
  });

  return orderItems;
};

export const transformOrderItemsPDF = (
  items: OrderItemPdf[],
): OrderItemPdf[] => {
  const orderItems: OrderItemPdf[] = [];

  items.forEach(item => {
    if (item.data?.hasCustomDomain) {
      const customDomainItem = {
        ...item,
        id: `customDomain_${item.id}`,
        action: GenericAction.registerFioDomain,
        address: '',
        nativeFio: item.data.hasCustomDomainFee,
        price: apis.fio.convertFioToUsdc(
          item.data.hasCustomDomainFee,
          item.roe,
        ),
        feeCollected: renderFioPriceFromSuf(item.data.hasCustomDomainFee || 0),
      };

      orderItems.push(customDomainItem);

      orderItems.push({
        ...item,
        nativeFio: new MathOp(item.nativeFio)
          .sub(item.data.hasCustomDomainFee)
          .toString(),
        price: apis.fio.convertFioToUsdc(
          new MathOp(item.nativeFio)
            .sub(item.data.hasCustomDomainFee)
            .toString(),
          item.roe,
        ),
        feeCollected: renderFioPriceFromSuf(item.feeCollected || 0),
      });
    } else {
      orderItems.push({
        ...item,
        feeCollected: renderFioPriceFromSuf(item.feeCollected || 0),
      });
    }
  });

  return orderItems;
};
