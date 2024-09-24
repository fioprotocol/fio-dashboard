import { FIOSDK, GenericAction } from '@fioprotocol/fiosdk';

import MathOp from './math';
import apis from '../api';

import { OrderItem } from '../types';

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
        price: apis.fio
          .convertFioToUsdc(
            new MathOp(item.data.hasCustomDomainFee).toNumber(),
            new MathOp(item.order.roe).toNumber(),
          )
          .toFixed(2),
        feeCollected: FIOSDK.SUFToAmount(
          +item.data.hasCustomDomainFee || 0,
        ).toFixed(2),
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
        feeCollected: FIOSDK.SUFToAmount(
          (item.blockchainTransactions?.find(
            ({ action }) => action === GenericAction.registerFioDomain,
          )
            ? item.blockchainTransactions.find(
                ({ action }) => action === GenericAction.registerFioAddress,
              )?.feeCollected
            : item.blockchainTransactions?.[0]?.feeCollected -
              +item.data.hasCustomDomainFee) || 0,
        ).toFixed(2),
      });
    } else {
      orderItems.push({
        ...item,
        feeCollected: FIOSDK.SUFToAmount(
          item.blockchainTransactions?.[0]?.feeCollected || 0,
        ).toFixed(2),
      });
    }
  });

  return orderItems;
};
