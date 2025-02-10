import { useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Props as ComponentProps } from './NoProfileFlowRegisterFioHandle';

import { addItem as addItemToCart } from '../../redux/cart/actions';

import apis from '../../api';
import { FIO_ADDRESS_DELIMITER, setFioName } from '../../utils';
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
import { cartItems as cartItemsSelector } from '../../redux/cart/selectors';
import { refProfileCode } from '../../redux/refProfile/selectors';

import { AddressWidgetProps } from '../../components/AddressWidget/AddressWidget';
import { DomainItemType } from '../../types';

import classes from './NoProfileFlowRegisterFioHandle.module.scss';

type UseContextProps = {
  addressWidgetContent: AddressWidgetProps;
  domainName: string;
  verificationParams: {
    hasFioVerificationError: boolean;
    infoMessage: string;
    isVerifying: boolean;
    isFioItemVerified: boolean;
  };
};

export const useContext = (componentProps: ComponentProps): UseContextProps => {
  const { refProfile, publicKey } = componentProps;

  const cartItems = useSelector(cartItemsSelector);
  const prices = useSelector(pricesSelector);
  const refCode = useSelector(refProfileCode);
  const roe = useSelector(roeSelector);

  const [infoMessage, setInfoMessage] = useState<string>(null);
  const [hasFioVerificationError, toggleFioVerificationError] = useState<
    boolean
  >(false);
  const [publicKeyFreeAddresses, setPublicKeyFreeAddresses] = useState<
    { name: string; publicKey: string }[]
  >(null);
  const [isVerifying, toggleIsVerifying] = useState<boolean>(false);
  const [isFioItemVerified, toggleIsFioItemVerified] = useState<boolean>(false);
  const [showCustomDomainInput, toggleShowCustomDomain] = useState(false);

  const history = useHistory();
  const dispatch = useDispatch();

  const domainsList = refProfile?.settings?.domains;

  const refDomainObj = domainsList && domainsList[0];
  const domainName = refDomainObj?.name;

  const options = domainsList?.map(domainItem => ({
    id: domainItem.name,
    name: `${FIO_ADDRESS_DELIMITER}${domainItem.name}`,
  }));

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
    toggleIsFioItemVerified(false);

    return value;
  }, []);

  const nonVerifiedSubmit = useCallback(
    async ({
      address: addressValue,
      domain: domainValue,
    }: {
      address: string;
      domain?: string;
    }) => {
      if (!addressValue) return;

      const domain = domainValue || domainName;

      try {
        if (!domain) return;

        toggleIsVerifying(true);

        const fioHandle = setFioName(addressValue, domain);

        if (
          !apis.fio.publicFioSDK.validateFioAddress(fioHandle) ||
          validateFioAddress(addressValue, domain)
        ) {
          setInfoMessage(NON_VALID_FCH);
          toggleIsFioItemVerified(false);
          toggleIsVerifying(false);
          return;
        }

        const isRegistered = await apis.fio.availCheckTableRows(fioHandle);
        const chainDomain = await apis.fio.getFioDomain(domain);

        if (isRegistered || (chainDomain && chainDomain.is_public === 0)) {
          toggleFioVerificationError(true);
          setInfoMessage(
            `This FIO Handle - ${setFioName(
              addressValue,
              domain,
            )} is not available.`,
          );
          toggleIsFioItemVerified(false);
          toggleIsVerifying(false);
          return;
        }

        toggleIsFioItemVerified(true);
        toggleIsVerifying(false);
        setInfoMessage(
          `This FIO Handle - ${setFioName(addressValue, domain)} is available.`,
        );
      } catch (error) {
        log.error(error);
      }
    },
    [domainName],
  );

  const verifiedSubmit = useCallback(
    async ({
      address: addressValue,
      domain: domainValue,
    }: {
      address: string;
      domain?: string;
    }) => {
      if (!addressValue) return;

      try {
        const { name: refDomain, isPremium } = refDomainObj || {};

        let domain = refDomain,
          domainType: DomainItemType = isPremium
            ? DOMAIN_TYPE.PREMIUM
            : DOMAIN_TYPE.ALLOW_FREE,
          type = CART_ITEM_TYPE.ADDRESS,
          nativeFioItemPrice = prices.nativeFio.address;

        if (domainValue) {
          const existingDomainInList = domainsList.find(
            domainListItem => domainListItem.name === domainValue,
          );

          const existingDomainInChain = await apis.fio.getFioDomain(
            domainValue,
          );

          domain = domainValue;

          if (existingDomainInList || existingDomainInChain) {
            domainType =
              existingDomainInList?.isPremium ||
              (!existingDomainInList && existingDomainInChain)
                ? DOMAIN_TYPE.PREMIUM
                : DOMAIN_TYPE.ALLOW_FREE;
            type = CART_ITEM_TYPE.ADDRESS;
            nativeFioItemPrice = prices.nativeFio.address;
          } else {
            domainType = DOMAIN_TYPE.CUSTOM;
            type = CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN;
            nativeFioItemPrice = prices.nativeFio.combo;
          }
        }

        const { fio, usdc } = convertFioPrices(nativeFioItemPrice, roe);

        const fch = setFioName(addressValue, domain);
        const cartItem = {
          id: fch,
          address: addressValue,
          domain,
          costFio: fio,
          costUsdc: usdc,
          costNativeFio: nativeFioItemPrice,
          domainType,
          isFree:
            !domainValue &&
            !isPremium &&
            !cartHasFreeItem &&
            !existingPublicKeyFreeAddress,
          period: 1,
          type,
        };

        dispatch(
          addItemToCart({
            item: cartItem,
            publicKey,
            refCode,
          }),
        );

        history.push(ROUTES.CART);
      } catch (error) {
        log.error(error);
      }
    },
    [
      refDomainObj,
      prices.nativeFio,
      refCode,
      roe,
      cartHasFreeItem,
      existingPublicKeyFreeAddress,
      dispatch,
      publicKey,
      history,
      domainsList,
    ],
  );

  const addressWidgetContent = {
    buttonText:
      domainsList?.length > 1 && isFioItemVerified ? 'REGISTER' : 'GET IT',
    disabled: isVerifying,
    disabledInput: isVerifying,
    isBlueButton: domainsList?.length > 1 && isFioItemVerified,
    isValidating: isVerifying,
    options,
    formatOnFocusOut: true,
    logoSrc: refProfile?.settings?.img,
    placeHolderText: 'Enter your handle',
    prefix: FIO_ADDRESS_DELIMITER,
    showCustomDomainInput,
    subtitle:
      'Create a single, secure, customizable handle for your crypto wallet.',
    suffixText: domainName ? `@${domainName}` : '',
    title: 'Register FIO Handle',
    dropdownClassNames: classes.dropdown,
    controlClassNames: classes.control,
    placeholderClassNames: classes.placeholder,
    menuClassNames: classes.menu,
    arrowCloseClassNames: classes.arrowClose,
    arrowOpenClassNames: classes.arrowOpen,
    optionItemClassNames: classes.optionItem,
    optionButtonClassNames: classes.optionButton,
    classNameContainer: classes.widgetContainer,
    inputCustomDomainClassNames: classes.customDomainInput,
    regInputCustomDomainClassNames: classes.customDomainRegInput,
    defaultValue: options && options[0],
    convert: onFocusOut,
    customHandleSubmit: isFioItemVerified ? verifiedSubmit : nonVerifiedSubmit,
    onInputChanged,
    toggleShowCustomDomain,
  };

  const verificationParams = {
    hasFioVerificationError,
    infoMessage,
    isVerifying,
    isFioItemVerified,
  };

  useEffect(() => {
    if (publicKey) {
      void getFreePublicKeyAddresses(publicKey);
    }
  }, [getFreePublicKeyAddresses, publicKey]);

  return {
    addressWidgetContent,
    domainName,
    verificationParams,
  };
};
