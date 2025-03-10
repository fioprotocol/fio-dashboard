import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { EndPoint, GenericAction } from '@fioprotocol/fiosdk';

import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import {
  ANALYTICS_EVENT_ACTIONS,
  CART_ITEM_TYPE,
} from '../../constants/common';
import { DOMAIN_TYPE } from '../../constants/fio';
import { ROUTES } from '../../constants/routes';

import {
  fees as feesSelector,
  feesLoading as feeLoadingSelector,
} from '../../redux/fio/selectors';
import {
  cartId as cartIdSelector,
  cartItems as cartItemsSelector,
} from '../../redux/cart/selectors';
import { userId as userIdSelector } from '../../redux/profile/selectors';
import { refProfileCode } from '../../redux/refProfile/selectors';

import { addItem as addItemToCart } from '../../redux/cart/actions';
import { getFee } from '../../redux/fio/actions';

import {
  fireAnalyticsEvent,
  getCartItemsDataForAnalytics,
} from '../../util/analytics';
import useQuery from '../../hooks/useQuery';
import FioLoader from '../../components/common/FioLoader/FioLoader';
import useEffectOnce from '../../hooks/general';

const FioDomainRenewPage: React.FC = () => {
  const cartId = useSelector(cartIdSelector);
  const cartItems = useSelector(cartItemsSelector);
  const fees = useSelector(feesSelector);
  const feeLoading = useSelector(feeLoadingSelector);
  const refCode = useSelector(refProfileCode);
  const userId = useSelector(userIdSelector);

  const [feeLoadingFinished, toggleFeeLoadingFinished] = useState<boolean>(
    false,
  );

  const queryParams = useQuery();
  const history = useHistory();
  const dispatch = useDispatch();

  const domain = queryParams.get(QUERY_PARAMS_NAMES.NAME);

  const renewFioDomain = EndPoint.renewFioDomain;

  const renewDomainFeePrice = fees[renewFioDomain];
  const domainRenewFeeLoading = feeLoading[renewFioDomain];

  useEffectOnce(() => {
    dispatch(getFee(renewFioDomain));
  }, [dispatch, renewFioDomain]);

  useEffect(() => {
    if (domainRenewFeeLoading === false) {
      toggleFeeLoadingFinished(true);
    }
  }, [domainRenewFeeLoading]);

  useEffect(() => {
    if (feeLoading[renewFioDomain]) return;

    if (feeLoadingFinished && !renewDomainFeePrice) {
      history.replace(ROUTES.FIO_DOMAINS);
      return;
    }

    if (!renewDomainFeePrice) return;

    const newCartItem = {
      domain,
      type: CART_ITEM_TYPE.DOMAIN_RENEWAL,
      id: `${domain}-${GenericAction.renewFioDomain}-${+new Date()}`,
      period: 1,
      costNativeFio: renewDomainFeePrice?.nativeFio,
      costFio: renewDomainFeePrice.fio,
      costUsdc: renewDomainFeePrice.usdc,
      domainType: DOMAIN_TYPE.PRIVATE,
    };
    dispatch(
      addItemToCart({
        item: newCartItem,
        refCode,
      }),
    );
    fireAnalyticsEvent(
      ANALYTICS_EVENT_ACTIONS.ADD_ITEM_TO_CART,
      getCartItemsDataForAnalytics([newCartItem]),
    );
    fireAnalyticsEvent(
      ANALYTICS_EVENT_ACTIONS.BEGIN_CHECKOUT,
      getCartItemsDataForAnalytics([...cartItems, newCartItem]),
    );
    history.replace(ROUTES.CART);
  }, [
    cartId,
    cartItems,
    dispatch,
    domain,
    feeLoading,
    feeLoadingFinished,
    history,
    renewDomainFeePrice,
    renewFioDomain,
    refCode,
    userId,
  ]);

  return (
    <div className="mx-auto my-auto">
      <FioLoader wrap />
    </div>
  );
};

export default FioDomainRenewPage;
