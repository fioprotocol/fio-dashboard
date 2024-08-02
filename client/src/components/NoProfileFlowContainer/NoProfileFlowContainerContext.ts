import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Cookies from 'js-cookie';
import { Ecc } from '@fioprotocol/fiojs';

import {
  refProfileInfo,
  loading as loadingSelector,
} from '../../redux/refProfile/selectors';

import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { NON_VALID_FIO_PUBLIC_KEY } from '../../constants/errors';

import useQuery from '../../hooks/useQuery';
import useEffectOnce from '../../hooks/general';
import { setCookies } from '../../util/cookies';
import { log } from '../../util/general';

import { RefProfile } from '../../types';
import { AddressWidgetProps } from '../AddressWidget/AddressWidget';

type UseContextProps = {
  addressWidgetContent: AddressWidgetProps;
  publicKey: string | null;
  refProfile: RefProfile;
  loading: boolean;
  verificationParams: {
    hasFioVerificationError: boolean;
    infoMessage: string;
    isVerifying: boolean;
    isFioItemVerified: boolean;
    infoBadge: {
      title: string;
      message: string;
      boldMessage: string;
    };
  };
};

export const useContext = (): UseContextProps => {
  const refProfile = useSelector(refProfileInfo);
  const loading = useSelector(loadingSelector);

  const history = useHistory();
  const queryParams = useQuery();

  const [infoMessage, setInfoMessage] = useState<string>(null);
  const [hasFioVerificationError, toggleFioVerificationError] = useState<
    boolean
  >(false);

  const [isVerifying, toggleIsVerifying] = useState<boolean>(false);
  const [isFioItemVerified, toggleIsFioItemVerified] = useState<boolean>(false);

  const publicKeyQueryParams =
    queryParams.get(QUERY_PARAMS_NAMES.PUBLIC_KEY) || null;
  const publicKeyCookie = Cookies.get(QUERY_PARAMS_NAMES.PUBLIC_KEY);

  const publicKey = publicKeyQueryParams || publicKeyCookie;

  const onInputChanged = useCallback((value: string) => {
    setInfoMessage(null);
    toggleFioVerificationError(false);
    toggleIsFioItemVerified(false);

    return value;
  }, []);

  const checkIsFioPublicKeyValid = useCallback((publicKeyToValid: string) => {
    try {
      return Ecc.PublicKey.isValid(publicKeyToValid);
    } catch (error) {
      log.error(error);
      return false;
    }
  }, []);

  const customHandleSubmit = useCallback(
    ({ address: publicKeyValue }: { address: string }) => {
      if (!publicKeyValue) return;

      try {
        toggleIsVerifying(true);

        const isPublicKeyVerified = checkIsFioPublicKeyValid(publicKeyValue);

        if (!isPublicKeyVerified) {
          setInfoMessage(NON_VALID_FIO_PUBLIC_KEY);
          toggleIsFioItemVerified(false);
          toggleIsVerifying(false);
          toggleFioVerificationError(true);
          return;
        }

        history.push({
          search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${publicKeyValue}`,
        });

        toggleIsFioItemVerified(true);
        toggleIsVerifying(false);
      } catch (error) {
        log.error(error);
      }
    },
    [checkIsFioPublicKeyValid, history],
  );

  const addressWidgetContent = {
    buttonText: 'SUBMIT',
    disabled: isVerifying,
    disabledInput: isVerifying,
    logoSrc: refProfile?.settings?.img,
    formatOnFocusOut: false,
    lowerCased: false,
    placeHolderText: 'Enter public key',
    subtitle:
      'Many wallets support FIO Protocol and allow you to easily register FIO Handle or FIO Domain and link it to that wallet. Check your favorite wallet for a FIO Handle registration.',
    title: 'Link Your Wallet',
    actionText: 'Alternatively, you enter FIO Public key manually below.',
    customHandleSubmit,
    onInputChanged: onInputChanged,
  };

  const verificationParams = {
    hasFioVerificationError,
    infoMessage,
    isVerifying,
    isFioItemVerified,
    infoBadge: {
      title: 'This options should only used by crypto experts.',
      message:
        "Once you enter your FIO Public key you will not be able to change it, even if you've made an error or loose the assiciated private key. ",
      boldMessage:
        'We strongly recommend that you use one of our partner wallet instead.',
    },
  };

  useEffect(() => {
    if (publicKey) {
      const isFioPublicKeyValid = checkIsFioPublicKeyValid(publicKey);

      if (!isFioPublicKeyValid) {
        setCookies(QUERY_PARAMS_NAMES.PUBLIC_KEY, null, { expires: null });

        const searchParams = new URLSearchParams(window.location.search);
        searchParams.delete(QUERY_PARAMS_NAMES.PUBLIC_KEY);
        const newSearchString = searchParams.toString();
        history.push({ search: newSearchString });
      }
    }
  }, [history, publicKey, checkIsFioPublicKeyValid]);

  useEffectOnce(
    () => {
      (!publicKeyCookie ||
        (publicKey && publicKeyCookie && publicKey !== publicKeyCookie)) &&
        setCookies(QUERY_PARAMS_NAMES.PUBLIC_KEY, publicKey, { expires: null });
      !publicKeyQueryParams &&
        history.push({
          search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${publicKey}`,
        });
    },
    [],
    !!publicKey && checkIsFioPublicKeyValid(publicKey),
  );

  return {
    addressWidgetContent,
    refProfile,
    publicKey,
    loading,
    verificationParams,
  };
};
