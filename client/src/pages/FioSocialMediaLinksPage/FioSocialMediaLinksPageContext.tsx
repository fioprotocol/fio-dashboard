import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { toggleSocialMediaListInfoBadge } from '../../redux/fio/actions';

import {
  currentFioAddress as currentFioAddressSelector,
  loading as loadingSelector,
  showSocialMediaListInfoBadge as showSocialMediaListInfoBadgeSelector,
} from '../../redux/fio/selectors';

import { usePublicAddresses } from '../../util/hooks';
import useQuery from '../../hooks/useQuery';

import { CHAIN_CODES } from '../../constants/common';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { SOCIAL_MEDIA_LINKS } from '../../constants/socialMediaLinks';
import {
  ACTION_SUCCESS_MESSAGES,
  SOCIAL_MEDIA_CONTAINER_NAMES,
} from '../../components/LinkTokenList/constants';

import { PublicAddressDoublet } from '../../types';

type UseContextProps = {
  loading: boolean;
  fch: string;
  search: string;
  showBadge: boolean;
  socialMediaLinks: ({
    iconSrc: string;
    link: string;
    name: string;
  } & PublicAddressDoublet)[];
  successBadgeMessage: string;
  onBadgeClose: () => void;
  onClose: () => void;
};

export const useContext = (): UseContextProps => {
  const queryParams = useQuery();

  const history = useHistory<{
    actionType: typeof SOCIAL_MEDIA_CONTAINER_NAMES[keyof typeof SOCIAL_MEDIA_CONTAINER_NAMES];
  }>();

  const { location: { state, search: searchString } = {} } = history;
  const searchParams = new URLSearchParams(searchString);
  const query = Object.fromEntries(searchParams.entries());
  const fchFromHistoryQuery = query[QUERY_PARAMS_NAMES.FIO_HANDLE];

  const fch =
    queryParams.get(QUERY_PARAMS_NAMES.FIO_HANDLE) || fchFromHistoryQuery;

  const [successBadgeMessage, setSuccessBadgeMessage] = useState('');

  const showBadge = useSelector(showSocialMediaListInfoBadgeSelector);
  const currentFioAddress = useSelector(state =>
    currentFioAddressSelector(state, fch),
  );
  const loading = useSelector(loadingSelector);

  const { actionType } = state || {};

  const dispatch = useDispatch();

  usePublicAddresses(fch);

  const search = `?${QUERY_PARAMS_NAMES.FIO_HANDLE}=${fch}`;

  const { publicAddresses = [] } = currentFioAddress || {};

  const onClose = useCallback(() => {
    dispatch(toggleSocialMediaListInfoBadge(false));
  }, [dispatch]);

  const onBadgeClose = useCallback(() => {
    setSuccessBadgeMessage('');
  }, []);

  useEffect(() => {
    if (actionType) {
      setSuccessBadgeMessage(ACTION_SUCCESS_MESSAGES[actionType]);
    }
  }, [actionType]);

  return {
    fch,
    loading,
    search,
    showBadge,
    socialMediaLinks: publicAddresses
      .filter(publicAddress => publicAddress.chainCode === CHAIN_CODES.SOCIALS)
      .map(pubicAddress => {
        const socialMediaLinkItem = SOCIAL_MEDIA_LINKS.find(
          socialMedeiaLink =>
            socialMedeiaLink.tokenName.toLowerCase() ===
            pubicAddress.tokenCode.toLowerCase(),
        );

        return {
          ...pubicAddress,
          iconSrc: socialMediaLinkItem?.iconSrc,
          link: socialMediaLinkItem?.link + pubicAddress.publicAddress,
          name: socialMediaLinkItem?.name,
        };
      }),
    successBadgeMessage,
    onBadgeClose,
    onClose,
  };
};
