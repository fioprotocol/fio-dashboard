import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FormRenderProps } from 'react-final-form';

import {
  currentFioAddress,
  fioWallets as fioWalletsSelector,
} from '../../redux/fio/selectors';

import { linkTokens } from '../../api/middleware/fio';
import { minWaitTimeFunction } from '../../utils';
import { log } from '../../util/general';

import { usePublicAddresses } from '../../util/hooks';
import useQuery from '../../hooks/useQuery';
import { useGetMappedErrorRedirect } from '../../hooks/fio';

import { TOKEN_LINK_MIN_WAIT_TIME } from '../../constants/fio';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import {
  ErrorsProps,
  validate as validation,
  validateToken as validationToken,
} from './validation';

import {
  PublicAddressDoublet,
  WalletKeys,
  LinkActionResult,
} from '../../types';
import { AddTokenContextProps, FormValues } from './types';

export const useContext = (): AddTokenContextProps => {
  const queryParams = useQuery();
  const fioCryptoHandleName = queryParams.get(QUERY_PARAMS_NAMES.FIO_HANDLE);

  const fioCryptoHandleObj = useSelector(state =>
    currentFioAddress(state, fioCryptoHandleName),
  );
  const fioWallets = useSelector(fioWalletsSelector);

  usePublicAddresses(fioCryptoHandleName);

  useGetMappedErrorRedirect(fioCryptoHandleName);

  const { edgeWalletId = '', publicAddresses = [], walletPublicKey = '' } =
    fioCryptoHandleObj || {};

  const fioWallet = fioWallets.find(
    ({ publicKey }) => publicKey === walletPublicKey,
  );

  const [results, setResultsData] = useState<LinkActionResult>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [submitData, setSubmitData] = useState<
    FormValues | PublicAddressDoublet[] | null
  >(null);
  const [bundleCost, changeBundleCost] = useState<number>(0);

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

  const submit = async ({
    keys,
    data,
  }: {
    keys: WalletKeys;
    data: FormValues;
  }) => {
    const params: {
      fioAddress: string;
      connectList: PublicAddressDoublet[];
      keys: WalletKeys;
    } = {
      fioAddress: fioCryptoHandleName,
      connectList: data.tokens,
      keys,
    };
    try {
      const actionResults = await minWaitTimeFunction(
        () => linkTokens(params),
        TOKEN_LINK_MIN_WAIT_TIME,
      );
      setResultsData(actionResults);
    } catch (err) {
      log.error(err);
    } finally {
      setSubmitData(null);
    }
  };

  const onBack = (formProps: FormRenderProps<FormValues>) => {
    const { form } = formProps;
    form.reset();
    form.mutators.push('tokens');
    setResultsData(null);
    changeBundleCost(0);
  };

  const onRetry = (resultsData: LinkActionResult) => {
    setSubmitData(resultsData.connect.failed);
  };

  const validate = (values: FormValues) => validation(values, publicAddresses);
  const validateToken = (token: PublicAddressDoublet, values: FormValues) => {
    const results = validationToken(
      token,
      [...(values?.tokens || []), ...publicAddresses].filter(Boolean),
    );
    return Object.keys(results || {}).reduce((result, key) => {
      result[key] = results[key as keyof ErrorsProps].message;
      return result;
    }, {} as { [key: string]: string });
  };

  return {
    bundleCost,
    edgeWalletId,
    fioCryptoHandleObj,
    fioWallet,
    fioWallets,
    processing,
    results,
    submitData,
    changeBundleCost,
    onBack,
    onCancel,
    onRetry,
    onSubmit,
    onSuccess,
    setProcessing,
    submit,
    validate,
    validateToken,
    publicAddresses,
  };
};
