import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Props as ComponentProps } from './NoProfileFlowRenewFioHandlePage';

import { addItem as addItemToCart } from '../../redux/cart/actions';

import apis from '../../api';
import { validateFioAddress } from '../../util/fio';
import { convertFioPrices } from '../../util/prices';
import { log } from '../../util/general';

import { CART_ITEM_TYPE } from '../../constants/common';
import { ROUTES } from '../../constants/routes';
import { ACTIONS } from '../../constants/fio';

import {
  prices as pricesSelector,
  roe as roeSelector,
} from '../../redux/registrations/selectors';
import { cartId as cartIdSelector } from '../../redux/cart/selectors';
import { FIO_ADDRESS_DELIMITER } from '../../utils';

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
  const roe = useSelector(roeSelector);

  const [infoMessage, setInfoMessage] = useState<string>(null);
  const [hasFioVerificationError, toggleFioVerificationError] = useState<
    boolean
  >(false);

  const [isVerifying, toggleIsVerifying] = useState<boolean>(false);
  const [isFioItemVerified, toggleIsFioItemVerified] = useState<boolean>(false);

  const history = useHistory();
  const dispatch = useDispatch();

  const { fio, usdc } = convertFioPrices(prices.nativeFio.addBundles, roe);

  const onFocusOut = useCallback((value: string) => {
    if (!value) return;

    const [address, domain] = value.split(FIO_ADDRESS_DELIMITER);

    const isNotValidAddressError = validateFioAddress(address, domain);

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

  const customHandleSubmit = useCallback(
    async ({ address: fioHandle }: { address: string }) => {
      if (!fioHandle) return;

      try {
        toggleIsVerifying(true);

        const [address, domain] = fioHandle.split(FIO_ADDRESS_DELIMITER);

        const validateMessage = validateFioAddress(address, domain);

        if (validateMessage) {
          toggleFioVerificationError(true);
          setInfoMessage(validateMessage);
          toggleIsFioItemVerified(false);
          toggleIsVerifying(false);
          return;
        }

        const isRegistered = await apis.fio.availCheckTableRows(fioHandle);

        if (!isRegistered) {
          toggleFioVerificationError(true);
          setInfoMessage(`This FIO Handle - ${fioHandle} is not registered.`);
          toggleIsFioItemVerified(false);
          toggleIsVerifying(false);
          return;
        }

        const cartItem = {
          id: `${fioHandle}-${ACTIONS.addBundledTransactions}-${+new Date()}`,
          address,
          domain,
          costFio: fio,
          costUsdc: usdc,
          costNativeFio: prices.nativeFio.addBundles,
          type: CART_ITEM_TYPE.ADD_BUNDLES,
        };

        dispatch(
          addItemToCart({
            id: cartId,
            item: cartItem,
            publicKey,
            prices: prices?.nativeFio,
            roe,
          }),
        );

        setInfoMessage(null);
        toggleIsFioItemVerified(true);
        toggleIsVerifying(false);

        history.push(ROUTES.CART);
      } catch (error) {
        log.error(error);
      }
    },
    [fio, usdc, prices.nativeFio, dispatch, cartId, publicKey, roe, history],
  );

  const addressWidgetContent = {
    buttonText: 'ADD',
    disabled: isVerifying,
    disabledInput: isVerifying,
    formatOnFocusOut: true,
    logoSrc: refProfile?.settings?.img,
    placeHolderText: 'Enter your handle',
    subtitle: `Add bundles to your existing FIO Handle for ${usdc} USDC or equivalent.`,
    title: 'Add Bundles to FIO Handle',
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
