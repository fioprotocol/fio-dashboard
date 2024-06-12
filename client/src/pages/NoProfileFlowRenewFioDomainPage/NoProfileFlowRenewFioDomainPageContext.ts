import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Props as ComponentProps } from './NoProfileFlowRenewFioDomainPage';

import { addItem as addItemToCart } from '../../redux/cart/actions';

import apis from '../../api';
import { vaildateFioDomain } from '../../util/fio';
import { convertFioPrices } from '../../util/prices';
import { log } from '../../util/general';

import { CART_ITEM_TYPE } from '../../constants/common';
import { ROUTES } from '../../constants/routes';
import { ACTIONS, DOMAIN_TYPE } from '../../constants/fio';
import { NON_VAILD_DOMAIN } from '../../constants/errors';

import {
  prices as pricesSelector,
  roe as roeSelector,
} from '../../redux/registrations/selectors';
import { cartId as cartIdSelector } from '../../redux/cart/selectors';

type UseContextProps = {
  addressWidgetContent: {
    subtitle: string;
    title: string;
  };
  verificationParams: {
    hasFioVerificationError: boolean;
    infoMessage: string;
    isVerifying: boolean;
    isFioItemVerified: boolean;
  };
};

export const useContext = (componentProps: ComponentProps): UseContextProps => {
  const { refProfile, publicKey } = componentProps;

  const cartId = useSelector(cartIdSelector);
  const prices = useSelector(pricesSelector);
  const roe = useSelector(roeSelector);

  const [infoMessage, setInfoMessage] = useState<string>(null);
  const [hasFioVerificationError, toggleFioVerificationError] = useState<
    boolean
  >(false);

  const [isVerifying, toggleIsVerifying] = useState<boolean>(false);
  const [isFioItemVerified, toggleisFioItemVerified] = useState<boolean>(false);

  const history = useHistory();
  const dispatch = useDispatch();

  const { fio, usdc } = convertFioPrices(prices.nativeFio.renewDomain, roe);

  const onFocusOut = useCallback((value: string) => {
    if (!value) return;

    const isNotValidAddressError = vaildateFioDomain(value);

    if (isNotValidAddressError) {
      toggleFioVerificationError(true);
      setInfoMessage(isNotValidAddressError);
      return value;
    }

    toggleFioVerificationError(false);

    return value;
  }, []);

  const onInputChanged = useCallback((value: string) => {
    setInfoMessage(null);
    toggleFioVerificationError(false);
    toggleisFioItemVerified(false);

    return value;
  }, []);

  const customHandleSubmit = useCallback(
    async ({ address: domainValue }: { address: string }) => {
      if (!domainValue) return;

      try {
        toggleIsVerifying(true);

        try {
          apis.fio.isFioDomainValid(domainValue);
        } catch (error) {
          setInfoMessage(NON_VAILD_DOMAIN);
          toggleisFioItemVerified(false);
          toggleIsVerifying(false);
          return;
        }

        const isRegistered = await apis.fio.availCheckTableRows(domainValue);

        if (!isRegistered) {
          toggleFioVerificationError(true);
          setInfoMessage(`This FIO Domain - ${domainValue} is not registered.`);
          toggleisFioItemVerified(false);
          toggleIsVerifying(false);
          return;
        }

        const cartItem = {
          id: `${domainValue}-${ACTIONS.renewFioDomain}-${+new Date()}`,
          domain: domainValue,
          costFio: fio,
          costUsdc: usdc,
          costNativeFio: prices.nativeFio.renewDomain,
          domainType: DOMAIN_TYPE.PRIVATE,
          period: 1,
          type: CART_ITEM_TYPE.DOMAIN_RENEWAL,
        };

        dispatch(
          addItemToCart({
            id: cartId,
            item: cartItem,
            metamaskUserPublicKey: publicKey,
            prices: prices?.nativeFio,
            roe,
          }),
        );

        toggleisFioItemVerified(true);
        toggleIsVerifying(false);

        history.push(ROUTES.CART);
      } catch (error) {
        log.error(error);
      }
    },
    [fio, usdc, prices.nativeFio, dispatch, cartId, publicKey, roe, history],
  );

  const addressWidgetContent = {
    buttonText: 'RENEW',
    disabled: isVerifying,
    disabledInput: isVerifying,
    formatOnFocusOut: true,
    logoSrc: refProfile?.settings?.img,
    placeHolderText: 'Enter your domain',
    subtitle: `Renew your FIO domain for ${usdc} USDC or equivalent.`,
    title: 'Renew FIO Domain',
    convert: onFocusOut,
    customHandleSubmit,
    onInputChanged: onInputChanged,
  };

  const verificationParams = {
    hasFioVerificationError,
    infoMessage,
    isVerifying,
    isFioItemVerified,
  };

  return {
    addressWidgetContent,
    verificationParams,
  };
};
