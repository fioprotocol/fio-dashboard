import { useCallback, useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { updatePublicAddresses } from '../../redux/fio/actions';
import {
  currentFioAddress as currentFioAddressSelector,
  loading as loadingSelector,
  fioWallets as fioWalletsSelector,
} from '../../redux/fio/selectors';

import useQuery from '../../hooks/useQuery';
import { usePublicAddresses } from '../../util/hooks';
import { minWaitTimeFunction } from '../../utils';
import { linkTokens } from '../../api/middleware/fio';
import { log } from '../../util/general';

import { CHAIN_CODES } from '../../constants/common';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { SOCIAL_MEDIA_LINKS } from '../../constants/socialMediaLinks';
import { TOKEN_LINK_MIN_WAIT_TIME } from '../../constants/fio';
import { ROUTES } from '../../constants/routes';
import { SOCIAL_MEDIA_CONTAINER_NAMES } from '../../components/LinkTokenList/constants';

import {
  FioAddressWithPubAddresses,
  FioWalletDoublet,
  LinkActionResult,
  PublicAddressDoublet,
  SocialMediaLinkItem,
  WalletKeys,
} from '../../types';
import { FormValues } from './types';

type UseContextProps = {
  bundleCost: number;
  edgeWalletId: string;
  fioCryptoHandleObj: FioAddressWithPubAddresses;
  fioWallet: FioWalletDoublet;
  loading: boolean;
  processing: boolean;
  results: LinkActionResult;
  submitData: FormValues | PublicAddressDoublet[];
  changeBundleCost: (bundle: number) => void;
  onCancel: () => void;
  onRetry: (resultsData: LinkActionResult) => void;
  onSubmit: (values: FormValues) => void;
  onSuccess: () => void;
  setProcessing: (processing: boolean) => void;
  submit: (params: { keys: WalletKeys; data: FormValues }) => Promise<void>;
  socialMediaLinksList: SocialMediaLinkItem[];
};

export const useContext = (): UseContextProps => {
  const queryParams = useQuery();
  const fch = queryParams.get(QUERY_PARAMS_NAMES.FIO_HANDLE);

  const [socialMediaLinksList, setSocialMediaLinksList] = useState<
    SocialMediaLinkItem[]
  >([]);
  const [processing, setProcessing] = useState<boolean>(false);
  const [submitData, setSubmitData] = useState<
    FormValues | PublicAddressDoublet[] | null
  >(null);
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
    setSubmitData(values);
  };

  const onSuccess = () => {
    setProcessing(false);
  };

  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };

  const onRetry = (resultsData: LinkActionResult) => {
    setSubmitData(resultsData.connect.failed);
  };

  const submit = useCallback(
    async ({ keys, data }: { keys: WalletKeys; data: FormValues }) => {
      const params: {
        fioAddress: string;
        connectList: PublicAddressDoublet[];
        keys: WalletKeys;
      } = {
        fioAddress: fch,
        connectList: Object.entries(data).map(([key, value]) => {
          let publicAddress = '';
          if (typeof value !== undefined && typeof value === 'string') {
            publicAddress = value;
          }
          return {
            chainCode: CHAIN_CODES.SOCIALS,
            tokenCode: key.toUpperCase(),
            publicAddress: publicAddress,
          };
        }),
        keys,
      };

      try {
        const actionResults = await minWaitTimeFunction(
          () => linkTokens(params),
          TOKEN_LINK_MIN_WAIT_TIME,
        );
        if (actionResults) {
          setResultsData(actionResults);
          dispatch(
            updatePublicAddresses(fch, {
              addPublicAddresses: actionResults.connect.updated,
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
        }
      } catch (err) {
        log.error(err);
      } finally {
        setSubmitData(null);
      }
    },
    [dispatch, fch, history],
  );

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
              socialMediaContent.name.toLowerCase(),
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
    submit,
  };
};
