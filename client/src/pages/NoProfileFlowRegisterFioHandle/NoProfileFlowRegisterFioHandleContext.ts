import { useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Props as ComponentProps } from './NoProfileFlowRegisterFioHandle';

import { addItem as addItemToCart } from '../../redux/cart/actions';

import apis from '../../api';
import { setFioName } from '../../utils';
import { validateFioAddress } from '../../util/fio';
import { convertFioPrices } from '../../util/prices';
import { log } from '../../util/general';

import { CART_ITEM_TYPE } from '../../constants/common';
import { ROUTES } from '../../constants/routes';
import { DOMAIN_TYPE } from '../../constants/fio';
import { NON_VALID_FCH } from '../../constants/errors';

import {
  prices as pricesSelector,
  roe as roeSelector,
} from '../../redux/registrations/selectors';
import {
  cartId as cartIdSelector,
  cartItems as cartItemsSelector,
} from '../../redux/cart/selectors';

type UseContextProps = {
  addressWidgetContent: {
    subtitle: string;
    title: string;
  };
  domainName: string;
  verificationParams: {
    hasFioVerificationError: boolean;
    infoMessage: string;
    isVerifying: boolean;
    isFioHandleVerified: boolean;
  };
};

export const useContext = (componentProps: ComponentProps): UseContextProps => {
  const { refProfile, publicKey } = componentProps;

  const cartItems = useSelector(cartItemsSelector);
  const cartId = useSelector(cartIdSelector);
  const prices = useSelector(pricesSelector);
  const roe = useSelector(roeSelector);

  const [infoMessage, setInfoMessage] = useState<string>(null);
  const [hasFioVerificationError, toggleFioVerificationError] = useState<
    boolean
  >(false);
  const [publicKeyFreeAddresses, setPublicKeyFreeAddresses] = useState<
    { name: string; publicKey: string }[]
  >(null);
  const [isVerifying, toggleIsVerifying] = useState<boolean>(false);
  const [isFioHandleVerified, toggleIsFioHandleVerified] = useState<boolean>(
    false,
  );

  const history = useHistory();
  const dispatch = useDispatch();

  const refDomainObj = refProfile?.settings?.domains[0];
  const domainName = refDomainObj?.name;

  const cartHasFreeItem = cartItems.some(
    cartItem =>
      cartItem.isFree && cartItem.domainType === DOMAIN_TYPE.ALLOW_FREE,
  );

  const existingPublicKeyFreeAddress = publicKeyFreeAddresses?.length;

  const getFreePublicKeyAddresses = useCallback(async (publicKey: string) => {
    try {
      const existingFreeAddresses = await apis.users.getFreeAddresses({
        publicKey,
      });
      setPublicKeyFreeAddresses(existingFreeAddresses);
    } catch (error) {
      log.error(error);
    }
  }, []);

  const onFocusOut = useCallback(
    (value: string) => {
      if (!value) return;

      const isNotValidAddressError = validateFioAddress(value, domainName);

      if (isNotValidAddressError) {
        toggleFioVerificationError(true);
        setInfoMessage(isNotValidAddressError);
        return value;
      }

      toggleFioVerificationError(false);

      return value;
    },
    [domainName],
  );

  const onInputChanged = useCallback((value: string) => {
    setInfoMessage(null);
    toggleFioVerificationError(false);
    toggleIsFioHandleVerified(false);

    return value;
  }, []);

  const nonVerifiedSubmit = useCallback(
    async ({ address: addressValue }: { address: string }) => {
      if (!addressValue) return;

      try {
        if (!domainName) return;

        toggleIsVerifying(true);

        const fioHandle = setFioName(addressValue, domainName);

        try {
          apis.fio.isFioAddressValid(fioHandle);
        } catch (error) {
          setInfoMessage(NON_VALID_FCH);
          toggleIsFioHandleVerified(false);
          toggleIsVerifying(false);
          return;
        }

        const isRegistered = await apis.fio.availCheckTableRows(fioHandle);

        if (isRegistered) {
          toggleFioVerificationError(true);
          setInfoMessage(
            `This FIO Handle - ${setFioName(
              addressValue,
              domainName,
            )} is not available.`,
          );
          toggleIsFioHandleVerified(false);
          toggleIsVerifying(false);
          return;
        }

        toggleIsFioHandleVerified(true);
        toggleIsVerifying(false);
        setInfoMessage(
          `This FIO Handle - ${setFioName(
            addressValue,
            domainName,
          )} is available.`,
        );
      } catch (error) {
        log.error(error);
      }
    },
    [domainName],
  );

  const verifiedSubmit = useCallback(
    async ({ address: addressValue }: { address: string }) => {
      if (!addressValue) return;
      try {
        const { name: refDomain, isPremium } = refDomainObj || {};

        const { fio, usdc } = convertFioPrices(prices.nativeFio.address, roe);

        const fch = setFioName(addressValue, refDomain);
        const cartItem = {
          id: fch,
          address: addressValue,
          domain: refDomain,
          costFio: fio,
          costUsdc: usdc,
          costNativeFio: prices.nativeFio.address,
          domainType: isPremium ? DOMAIN_TYPE.PREMIUM : DOMAIN_TYPE.ALLOW_FREE,
          isFree:
            !isPremium && !cartHasFreeItem && !existingPublicKeyFreeAddress,
          period: 1,
          type: CART_ITEM_TYPE.ADDRESS,
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

        history.push(ROUTES.CART);
      } catch (error) {
        log.error(error);
      }
    },
    [
      cartHasFreeItem,
      cartId,
      existingPublicKeyFreeAddress,
      history,
      prices.nativeFio,
      publicKey,
      refDomainObj,
      roe,
      dispatch,
    ],
  );

  const addressWidgetContent = {
    disabled: isVerifying,
    disabledInput: isVerifying,
    formatOnFocusOut: true,
    logoSrc: refProfile?.settings?.img,
    placeHolderText: 'Enter your handle',
    subtitle:
      'Create a single, secure, customizable handle for your crypto wallet.',
    suffixText: domainName ? `@${domainName}` : '',
    title: 'Register FIO Handle',
    convert: onFocusOut,
    customHandleSubmit: isFioHandleVerified
      ? verifiedSubmit
      : nonVerifiedSubmit,
    onInputChanged: onInputChanged,
  };

  const verificationParams = {
    hasFioVerificationError,
    infoMessage,
    isVerifying,
    isFioHandleVerified,
  };

  useEffect(() => {
    if (publicKey) {
      getFreePublicKeyAddresses(publicKey);
    }
  }, [getFreePublicKeyAddresses, publicKey]);

  return {
    addressWidgetContent,
    domainName,
    verificationParams,
  };
};
