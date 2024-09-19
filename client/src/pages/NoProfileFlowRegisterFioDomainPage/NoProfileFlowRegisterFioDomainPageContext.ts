import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Props as ComponentProps } from './NoProfileFlowRegisterFioDomainPage';

import { addItem as addItemToCart } from '../../redux/cart/actions';

import apis from '../../api';
import { validateFioDomain } from '../../util/fio';
import { convertFioPrices } from '../../util/prices';
import { log } from '../../util/general';

import { CART_ITEM_TYPE } from '../../constants/common';
import { ROUTES } from '../../constants/routes';
import { DOMAIN_TYPE } from '../../constants/fio';
import { NON_VAILD_DOMAIN } from '../../constants/errors';

import {
  prices as pricesSelector,
  roe as roeSelector,
} from '../../redux/registrations/selectors';
import { cartId as cartIdSelector } from '../../redux/cart/selectors';
import { refProfileCode } from '../../redux/refProfile/selectors';

import { AddressWidgetProps } from '../../components/AddressWidget/AddressWidget';

type UseContextProps = {
  addressWidgetContent: AddressWidgetProps;
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
  const refCode = useSelector(refProfileCode);
  const roe = useSelector(roeSelector);

  const [infoMessage, setInfoMessage] = useState<string>(null);
  const [hasFioVerificationError, toggleFioVerificationError] = useState<
    boolean
  >(false);

  const [isVerifying, toggleIsVerifying] = useState<boolean>(false);
  const [isFioItemVerified, toggleIsFioItemVerified] = useState<boolean>(false);

  const history = useHistory();
  const dispatch = useDispatch();

  const { fio, usdc } = convertFioPrices(prices.nativeFio.domain, roe);

  const onFocusOut = useCallback((value: string) => {
    if (!value) return;

    const isNotValidAddressError = validateFioDomain(value);

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
    toggleIsFioItemVerified(false);

    return value;
  }, []);

  const nonVerifiedSubmit = useCallback(
    async ({ address: domainValue }: { address: string }) => {
      if (!domainValue) return;

      try {
        toggleIsVerifying(true);

        try {
          apis.fio.isFioDomainValid(domainValue);
        } catch (error) {
          setInfoMessage(NON_VAILD_DOMAIN);
          toggleIsFioItemVerified(false);
          toggleIsVerifying(false);
          return;
        }

        const isRegistered = await apis.fio.availCheckTableRows(domainValue);

        if (isRegistered) {
          toggleFioVerificationError(true);
          setInfoMessage(`This FIO Domain - ${domainValue} is not available.`);
          toggleIsFioItemVerified(false);
          toggleIsVerifying(false);
          return;
        }

        toggleIsFioItemVerified(true);
        toggleIsVerifying(false);
        setInfoMessage(`This FIO Domain - ${domainValue} is available.`);
      } catch (error) {
        log.error(error);
      }
    },
    [],
  );

  const verifiedSubmit = useCallback(
    async ({ address: domainValue }: { address: string }) => {
      if (!domainValue) return;

      try {
        const cartItem = {
          id: domainValue,
          domain: domainValue,
          costFio: fio,
          costUsdc: usdc,
          costNativeFio: prices.nativeFio.domain,
          domainType: DOMAIN_TYPE.CUSTOM,
          period: 1,
          type: CART_ITEM_TYPE.DOMAIN,
        };

        dispatch(
          addItemToCart({
            id: cartId,
            item: cartItem,
            publicKey,
            prices: prices?.nativeFio,
            refCode,
            roe,
          }),
        );

        history.push(ROUTES.CART);
      } catch (error) {
        log.error(error);
      }
    },
    [
      fio,
      usdc,
      prices.nativeFio,
      dispatch,
      cartId,
      publicKey,
      refCode,
      roe,
      history,
    ],
  );

  const addressWidgetContent = {
    disabled: isVerifying,
    disabledInput: isVerifying,
    formatOnFocusOut: true,
    logoSrc: refProfile?.settings?.img,
    placeHolderText: 'Enter a domain',
    subtitle: `Get your own custom FIO domain for ${usdc} USDC or equivalent.`,
    title: 'Register FIO Domain',
    convert: onFocusOut,
    customHandleSubmit: isFioItemVerified ? verifiedSubmit : nonVerifiedSubmit,
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
