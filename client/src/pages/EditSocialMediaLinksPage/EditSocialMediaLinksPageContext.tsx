import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import {
  currentFioAddress as currentFioAddressSelector,
  fioWallets as fioWalletsSelector,
} from '../../redux/fio/selectors';

import { ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION } from '../../constants/fio';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { SOCIAL_MEDIA_CONTAINER_NAMES } from '../../components/LinkTokenList/constants';
import { ROUTES } from '../../constants/routes';
import { CHAIN_CODES } from '../../constants/common';
import { SOCIAL_MEDIA_LINKS } from '../../constants/socialMediaLinks';

import useQuery from '../../hooks/useQuery';

import { extractLastValueFormUrl, isURL } from '../../util/general';
import { usePublicAddresses } from '../../util/hooks';

import {
  LinkActionResult,
  FioAddressWithPubAddresses,
  FioWalletDoublet,
  PublicAddressDoublet,
} from '../../types';

import { EditSocialLinkItem } from './types';

type UseContextProps = {
  bundleCost: number;
  edgeWalletId: string;
  fioCryptoHandleObj: FioAddressWithPubAddresses;
  fioWallet: FioWalletDoublet;
  hasLowBalance: boolean;
  isDisabled: boolean;
  processing: boolean;
  results: LinkActionResult;
  submitData: {
    fch: string;
    socialMediaLinksList: EditSocialLinkItem[] | PublicAddressDoublet[];
  } | null;
  socialMediaLinksList: EditSocialLinkItem[];
  changeBundleCost: (bundle: number) => void;
  handleEditTokenItem: (editedId: string, editedUsername: string) => void;
  onActionButtonClick: () => void;
  onBack: () => void;
  onCancel: () => void;
  onRetry: () => void;
  onSuccess: (resultsData: LinkActionResult) => void;
  setProcessing: (processing: boolean) => void;
};

export const useContext = (): UseContextProps => {
  const queryParams = useQuery();
  const fch = queryParams.get(QUERY_PARAMS_NAMES.FIO_CRYPTO_HANDLE);

  const [socialMediaLinksList, setSocialMediaLinksList] = useState<
    EditSocialLinkItem[]
  >([]);
  const [bundleCost, changeBundleCost] = useState<number>(0);
  const [results, setResultsData] = useState<LinkActionResult>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [submitData, setSubmitData] = useState<{
    fch: string;
    socialMediaLinksList: EditSocialLinkItem[] | PublicAddressDoublet[];
  } | null>(null);

  const currentFioAddress = useSelector(state =>
    currentFioAddressSelector(state, fch),
  );
  const fioWallets = useSelector(fioWalletsSelector);

  const history = useHistory();

  usePublicAddresses(fch);

  const {
    edgeWalletId = '',
    remaining = 0,
    publicAddresses = [],
    walletPublicKey = '',
  } = currentFioAddress || {};

  const fioWallet = fioWallets.find(
    ({ publicKey }) => publicKey === walletPublicKey,
  );

  const fioCryptoHandleObj = currentFioAddress;

  const hasLowBalance = remaining - bundleCost < 0;
  const hasEdited = socialMediaLinksList.some(
    socialMediaLinkItem => socialMediaLinkItem.newUsername,
  );

  const isDisabled = !hasEdited || hasLowBalance || remaining === 0;

  const pubAddressesToDefault = useCallback(() => {
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
              ...existingSocialMediaLink,
              username: pubAddress.publicAddress,
              isEditing: false,
              newUsername: '',
              id: existingSocialMediaLink.link,
            };
          }),
      );
  }, [publicAddresses]);

  useEffect(() => {
    pubAddressesToDefault();
  }, [pubAddressesToDefault]);

  const handleEditTokenItem = (editedId: string, editedUsername: string) => {
    const currentSocialLink = socialMediaLinksList.find(
      socialMediaLink => socialMediaLink.id === editedId,
    );
    if (!currentSocialLink) return;
    const { isEditing } = currentSocialLink;
    const updatePubAddressArr = () => {
      const updatedArr = socialMediaLinksList.map(socialMediaLink => {
        let editedValue = editedUsername;

        if (isURL(editedUsername)) {
          editedValue = extractLastValueFormUrl(editedUsername);
        } else {
          if (editedUsername.startsWith('@')) {
            editedValue = editedUsername.substr(1);
          }
        }

        if (socialMediaLink.id === editedId)
          return {
            ...socialMediaLink,
            newUsername:
              editedValue === socialMediaLink.username ? '' : editedValue,
            isEditing: !isEditing,
          };

        return { ...socialMediaLink, isEditing: false };
      });
      const editedCount = updatedArr.filter(
        socialMediaLink =>
          socialMediaLink.newUsername || socialMediaLink.isEditing,
      ).length;

      changeBundleCost(
        Math.ceil(editedCount / ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION),
      );
      setSocialMediaLinksList(updatedArr);
    };
    updatePubAddressArr();
  };

  const onSuccess = (resultsData: LinkActionResult) => {
    setProcessing(false);

    if (resultsData.connect.updated) {
      history.push({
        pathname: ROUTES.FIO_SOCIAL_MEDIA_LINKS,
        search: `${QUERY_PARAMS_NAMES.FIO_CRYPTO_HANDLE}=${fch}`,
        state: {
          actionType: SOCIAL_MEDIA_CONTAINER_NAMES.EDIT_SOCIAL_MEDIA,
        },
      });
    }

    setSubmitData(null);
  };

  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };

  const onActionButtonClick = () => {
    setSubmitData({ fch, socialMediaLinksList });
  };

  const onBack = () => {
    setResultsData(null);
    changeBundleCost(0);
    pubAddressesToDefault();
  };

  const onRetry = () => {
    setSubmitData({ fch, socialMediaLinksList });
  };

  return {
    bundleCost,
    edgeWalletId,
    fioCryptoHandleObj,
    fioWallet,
    hasLowBalance,
    isDisabled,
    processing,
    socialMediaLinksList,
    results,
    submitData,
    changeBundleCost,
    handleEditTokenItem,
    onActionButtonClick,
    onBack,
    onCancel,
    onRetry,
    onSuccess,
    setProcessing,
  };
};
