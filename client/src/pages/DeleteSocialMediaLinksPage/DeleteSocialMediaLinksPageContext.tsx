import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { updatePublicAddresses } from '../../redux/fio/actions';
import {
  currentFioAddress,
  fioWallets as fioWalletsSelector,
  loading as loadingSelector,
} from '../../redux/fio/selectors';

import { usePublicAddresses } from '../../util/hooks';
import useQuery from '../../hooks/useQuery';
import { useGetMappedErrorRedirect } from '../../hooks/fio';

import { BUNDLES_TX_COUNT } from '../../constants/fio';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { CHAIN_CODES } from '../../constants/common';
import { SOCIAL_MEDIA_LINKS } from '../../constants/socialMediaLinks';
import { ROUTES } from '../../constants/routes';
import { SOCIAL_MEDIA_CONTAINER_NAMES } from '../../components/LinkTokenList/constants';

import {
  FioAddressWithPubAddresses,
  FioWalletDoublet,
  LinkActionResult,
  PublicAddressDoublet,
} from '../../types';
import { CheckedSocialMediaLinkType } from './types';

type UseContextProps = {
  allChecked: boolean;
  bundleCost: number;
  edgeWalletId: string;
  fioCryptoHandleObj: FioAddressWithPubAddresses;
  fioWallet: FioWalletDoublet;
  hasChecked: boolean;
  hasLowBalance: boolean;
  isDisabled: boolean;
  loading: boolean;
  processing: boolean;
  socialMediaLinksList: CheckedSocialMediaLinkType[];
  resultsData: LinkActionResult;
  submitData: {
    fch: string;
    socialMediaLinksList: CheckedSocialMediaLinkType[] | PublicAddressDoublet[];
  };
  allCheckedChange: (isChecked: boolean) => void;
  setProcessing: (processing: boolean) => void;
  changeBundleCost: (bundles: number) => void;
  onActionClick: () => void;
  onBack: () => void;
  onCancel: () => void;
  onCheckClick: (checkedId: string) => void;
  onRetry: (resultsData: LinkActionResult) => void;
  onSuccess: (resultsData: LinkActionResult) => void;
};

export const useContext = (): UseContextProps => {
  const queryParams = useQuery();
  const fch = queryParams.get(QUERY_PARAMS_NAMES.FIO_CRYPTO_HANDLE);

  const fioCryptoHandleObj = useSelector(state =>
    currentFioAddress(state, fch),
  );

  usePublicAddresses(fch);
  useGetMappedErrorRedirect(fch);

  const fioWallets = useSelector(fioWalletsSelector);
  const loading = useSelector(loadingSelector);

  const [socialMediaLinksList, setSocialMediaLinksList] = useState<
    CheckedSocialMediaLinkType[]
  >([]);
  const [bundleCost, changeBundleCost] = useState<number>(0);
  const [allChecked, toggleAllChecked] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [submitData, setSubmitData] = useState<{
    fch: string;
    socialMediaLinksList: CheckedSocialMediaLinkType[] | PublicAddressDoublet[];
  } | null>(null);
  const [resultsData, setResultsData] = useState<LinkActionResult>(null);

  const history = useHistory();
  const dispatch = useDispatch();

  const {
    edgeWalletId = '',
    remaining = 0,
    publicAddresses = [],
    walletPublicKey = '',
  } = fioCryptoHandleObj || {};

  const hasLowBalance = remaining - bundleCost < 0 || remaining === 0;

  const hasChecked = socialMediaLinksList.some(
    socialMediaLinkItem => socialMediaLinkItem.isChecked,
  );

  const fioWallet = fioWallets.find(
    ({ publicKey }) => publicKey === walletPublicKey,
  );

  const isDisabled = !hasChecked || remaining === 0;

  const pubAddressesToDefault = useCallback(
    () =>
      publicAddresses &&
      setSocialMediaLinksList(
        publicAddresses
          .filter(pubAddress => pubAddress.chainCode === CHAIN_CODES.SOCIALS)
          .map(pubAddress => {
            const existingSocialMediaLink = SOCIAL_MEDIA_LINKS.find(
              socialMediaContent =>
                socialMediaContent.name.toLowerCase() ===
                pubAddress.tokenCode.toLowerCase(),
            );
            return {
              ...pubAddress,
              ...existingSocialMediaLink,
              link: existingSocialMediaLink.link + pubAddress.publicAddress,
              isChecked: false,
              id: existingSocialMediaLink.link,
            };
          }),
      ),
    [publicAddresses],
  );

  useEffect(() => {
    pubAddressesToDefault();
  }, [pubAddressesToDefault]);

  useEffect(() => {
    hasChecked
      ? changeBundleCost(BUNDLES_TX_COUNT.REMOVE_PUBLIC_ADDRESS)
      : changeBundleCost(0);
  }, [hasChecked]);

  useEffect(() => {
    toggleAllChecked(
      socialMediaLinksList.every(
        socialMediaLinkItem => socialMediaLinkItem.isChecked,
      ),
    );
  }, [socialMediaLinksList]);

  const onCheckClick = (checkedId: string) => {
    setSocialMediaLinksList(
      socialMediaLinksList.map(pubAddress =>
        pubAddress.id === checkedId
          ? {
              ...pubAddress,
              isChecked: !pubAddress.isChecked,
            }
          : pubAddress,
      ),
    );
  };

  const allCheckedChange = (isChecked: boolean) => {
    toggleAllChecked(isChecked);
    setSocialMediaLinksList(
      socialMediaLinksList.map(pubAddress => ({
        ...pubAddress,
        isChecked,
      })),
    );
  };

  const onSuccess = (resultsData: LinkActionResult) => {
    setProcessing(false);
    setResultsData(resultsData);
    dispatch(
      updatePublicAddresses(fch, {
        addPublicAddresses: [],
        deletePublicAddresses: resultsData.disconnect.updated,
      }),
    );
    history.push({
      pathname: ROUTES.FIO_SOCIAL_MEDIA_LINKS,
      search: `${QUERY_PARAMS_NAMES.FIO_CRYPTO_HANDLE}=${fch}`,
      state: {
        actionType: SOCIAL_MEDIA_CONTAINER_NAMES.DELETE_SOCIAL_MEDIA,
      },
    });
    setSubmitData(null);
  };

  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };

  const onActionClick = () => {
    setSubmitData({
      fch,
      socialMediaLinksList,
    });
  };

  const onBack = () => {
    setResultsData(null);
    changeBundleCost(0);
    pubAddressesToDefault();
  };

  const onRetry = (resultsData: LinkActionResult) => {
    setSubmitData({
      fch,
      socialMediaLinksList: resultsData.disconnect.failed,
    });
  };

  return {
    allChecked,
    bundleCost,
    edgeWalletId,
    fioCryptoHandleObj,
    fioWallet,
    hasChecked,
    hasLowBalance,
    isDisabled,
    loading,
    processing,
    socialMediaLinksList,
    resultsData,
    submitData,
    allCheckedChange,
    changeBundleCost,
    onActionClick,
    onBack,
    onCancel,
    onCheckClick,
    onRetry,
    onSuccess,
    setProcessing,
  };
};
