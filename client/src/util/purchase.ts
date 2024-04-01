import MathOp from './math';
import apis from '../api';

import { ACTIONS } from '../constants/fio';

import { OrderItem } from '../types';

export const transformOrderItems = (items: OrderItem[]): OrderItem[] => {
  const orderItems: OrderItem[] = [];

  items.forEach(item => {
    if (item.data?.hasCustomDomain) {
      const customDomainItem = {
        ...item,
        id: `customDomain_${item.id}`,
        action: ACTIONS.registerFioDomain,
        address: '',
        nativeFio: item.data.hasCustomDomainFee,
        price: apis.fio
          .convertFioToUsdc(
            new MathOp(item.data.hasCustomDomainFee).toNumber(),
            new MathOp(item.order.roe).toNumber(),
          )
          .toFixed(2),
        feeCollected: apis.fio
          .sufToAmount(+item.data.hasCustomDomainFee || 0)
          .toFixed(2),
      };

      orderItems.push(customDomainItem);

      orderItems.push({
        ...item,
        nativeFio: (+item.nativeFio - +item.data.hasCustomDomainFee).toFixed(),
        price: apis.fio
          .convertFioToUsdc(
            new MathOp(item.nativeFio).toNumber() -
              new MathOp(item.data.hasCustomDomainFee).toNumber(),
            new MathOp(item.order.roe).toNumber(),
          )
          .toFixed(2),
        feeCollected: apis.fio
          .sufToAmount(
            (item.blockchainTransactions?.find(
              ({ action }) => action === ACTIONS.registerFioDomain,
            )
              ? item.blockchainTransactions.find(
                  ({ action }) => action === ACTIONS.registerFioAddress,
                )?.feeCollected
              : item.blockchainTransactions?.[0]?.feeCollected -
                +item.data.hasCustomDomainFee) || 0,
          )
          .toFixed(2),
      });
    } else {
      orderItems.push({
        ...item,
        feeCollected: apis.fio
          .sufToAmount(item.blockchainTransactions?.[0]?.feeCollected || 0)
          .toFixed(2),
      });
    }
  });

  return orderItems;
};
