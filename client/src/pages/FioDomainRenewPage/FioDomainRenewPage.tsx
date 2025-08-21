import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { EndPoint } from '@fioprotocol/fiosdk';

import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { ROUTES } from '../../constants/routes';

import {
  prices as pricesSelector,
  roe as roeSelector,
  loading as loadingSelector,
} from '../../redux/registrations/selectors';

import {
  cartId as cartIdSelector,
  cartItems as cartItemsSelector,
} from '../../redux/cart/selectors';
import { userId as userIdSelector } from '../../redux/profile/selectors';
import { refProfileCode } from '../../redux/refProfile/selectors';

import { onDomainRenew } from '../../redux/cart/actions';
import { getFee } from '../../redux/fio/actions';

import useQuery from '../../hooks/useQuery';
import FioLoader from '../../components/common/FioLoader/FioLoader';
import useEffectOnce from '../../hooks/general';

const FioDomainRenewPage: React.FC = () => {
  const cartId = useSelector(cartIdSelector);
  const cartItems = useSelector(cartItemsSelector);
  const loadingPrices = useSelector(loadingSelector);
  const refCode = useSelector(refProfileCode);
  const prices = useSelector(pricesSelector);
  const roe = useSelector(roeSelector);
  const userId = useSelector(userIdSelector);

  const [pricesLoadingFinished, togglePricesLoadingFinished] = useState<
    boolean
  >(false);

  const queryParams = useQuery();
  const history = useHistory();
  const dispatch = useDispatch();

  const domain = queryParams.get(QUERY_PARAMS_NAMES.NAME);

  const renewFioDomain = EndPoint.renewFioDomain;

  useEffectOnce(() => {
    dispatch(getFee(renewFioDomain));
  }, [dispatch, renewFioDomain]);

  useEffect(() => {
    if (loadingPrices === false) {
      togglePricesLoadingFinished(true);
    }
  }, [loadingPrices]);

  useEffect(() => {
    if (loadingPrices) return;

    if (pricesLoadingFinished && !prices?.nativeFio?.renewDomain) {
      history.replace(ROUTES.FIO_DOMAINS);
      return;
    }

    if (!prices?.nativeFio?.renewDomain) return;

    dispatch(onDomainRenew({ domain }));
  }, [
    cartId,
    cartItems,
    dispatch,
    domain,
    history,
    renewFioDomain,
    refCode,
    userId,
    loadingPrices,
    pricesLoadingFinished,
    prices?.nativeFio,
    roe,
  ]);

  return (
    <div className="mx-auto my-auto">
      <FioLoader wrap />
    </div>
  );
};

export default FioDomainRenewPage;
