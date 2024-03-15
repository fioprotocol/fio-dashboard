import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {
  currentFioAddress as currentFioAddressSelector,
  loading as loadingSelector,
  fioWallets as fioWalletsSelector,
} from '../../redux/fio/selectors';

import useQuery from '../../hooks/useQuery';
import { usePublicAddresses } from '../../util/hooks';

import { CHAIN_CODES } from '../../constants/common';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { SOCIAL_MEDIA_LINKS } from '../../constants/socialMediaLinks';
import { ROUTES } from '../../constants/routes';
import { SOCIAL_MEDIA_CONTAINER_NAMES } from '../../components/LinkTokenList/constants';

import {
  FioAddressWithPubAddresses,
  FioWalletDoublet,
  LinkActionResult,
  PublicAddressDoublet,
  SocialMediaLinkItem,
} from '../../types';
import { FormValues } from './types';
import { updatePublicAddresses } from '../../redux/fio/actions';

type UseContextProps = {
  bundleCost: number;
  edgeWalletId: string;
  fioCryptoHandleObj: FioAddressWithPubAddresses;
  fioWallet: FioWalletDoublet;
  loading: boolean;
  processing: boolean;
  results: LinkActionResult;
  submitData: {
    fch: string;
    socialMediaLinksList: FormValues | PublicAddressDoublet[];
  };
  changeBundleCost: (bundle: number) => void;
  onCancel: () => void;
  onRetry: (resultsData: LinkActionResult) => void;
  onSubmit: (values: FormValues) => void;
  onSuccess: (resultsData: LinkActionResult) => void;
  setProcessing: (processing: boolean) => void;
  socialMediaLinksList: SocialMediaLinkItem[];
};

export const useContext = (): UseContextProps => {
  const queryParams = useQuery();
  const fch = queryParams.get(QUERY_PARAMS_NAMES.FIO_HANDLE);

  const [socialMediaLinksList, setSocialMediaLinksList] = useState<
    SocialMediaLinkItem[]
  >([]);
  const [processing, setProcessing] = useState<boolean>(false);
  const [submitData, setSubmitData] = useState<{
    fch: string;
    socialMediaLinksList: FormValues | PublicAddressDoublet[];
  } | null>(null);
  const [bundleCost, changeBundleCost] = useState<number>(0);
  const [results, setResultsData] = useState<LinkActionResult>(null);

  const currentFioAddress = useSelector(state =>
    currentFioAddressSelector(state, fch),
  );
  const loading = useSelector(loadingSelector);
  const fioWallets = useSelector(fioWalletsSelector);

  const history = useHistory();
  const dispatch = useDispatch();

  usePublicAddresses(fch);

  const { edgeWalletId = '', publicAddresses = [], walletPublicKey = '' } =
    currentFioAddress || {};

  const fioWallet = fioWallets.find(
    ({ publicKey }) => publicKey === walletPublicKey,
  );

  const fioCryptoHandleObj = currentFioAddress;

  const onSubmit = (values: FormValues) => {
    setSubmitData({ fch, socialMediaLinksList: values });
  };

  const onSuccess = (resultsData: LinkActionResult) => {
    setResultsData(resultsData);
    dispatch(
      updatePublicAddresses(fch, {
        addPublicAddresses: resultsData.connect.updated,
        deletePublicAddresses: [],
      }),
    );
    history.push({
      pathname: ROUTES.FIO_SOCIAL_MEDIA_LINKS,
      search: `${QUERY_PARAMS_NAMES.FIO_HANDLE}=${fch}`,
      state: {
        actionType: SOCIAL_MEDIA_CONTAINER_NAMES.ADD_SOCIAL_MEDIA,
      },
    });
    setProcessing(false);
    setSubmitData(null);
  };

  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };

  const onRetry = (resultsData: LinkActionResult) => {
    setSubmitData({ fch, socialMediaLinksList: resultsData.connect.failed });
  };

  const publicAddressesJson = JSON.stringify(publicAddresses);

  useEffect(() => {
    const parsedPubicAddresses: PublicAddressDoublet[] = JSON.parse(
      publicAddressesJson,
    );

    const existingSocialMediaLinksList = parsedPubicAddresses.filter(
      pubicAddress => pubicAddress.chainCode === CHAIN_CODES.SOCIALS,
    );

    setSocialMediaLinksList(
      SOCIAL_MEDIA_LINKS.filter(
        socialMediaContent =>
          !existingSocialMediaLinksList.find(
            existingSocialMediaLink =>
              existingSocialMediaLink.tokenCode.toLowerCase() ===
              socialMediaContent.tokenName.toLowerCase(),
          ),
      ),
    );
  }, [publicAddressesJson]);

  return {
    bundleCost,
    edgeWalletId,
    fioCryptoHandleObj,
    fioWallet,
    loading,
    processing,
    results,
    socialMediaLinksList,
    submitData,
    changeBundleCost,
    onCancel,
    onRetry,
    onSubmit,
    onSuccess,
    setProcessing,
  };
};
