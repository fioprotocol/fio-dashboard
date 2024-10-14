import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FormRenderProps } from 'react-final-form';

import {
  currentFioAddress,
  fioWallets as fioWalletsSelector,
} from '../../redux/fio/selectors';

import { usePublicAddresses } from '../../util/hooks';
import useQuery from '../../hooks/useQuery';
import { useGetMappedErrorRedirect } from '../../hooks/fio';

import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import {
  ErrorsProps,
  validate as validation,
  validateToken as validationToken,
} from './validation';

import { LinkActionResult, PublicAddressDoublet } from '../../types';
import { AddTokenContextProps, AddTokenValues, SubmitDataProps } from './types';

export const useContext = (): AddTokenContextProps => {
  const queryParams = useQuery();
  const fioCryptoHandleName = queryParams.get(QUERY_PARAMS_NAMES.FIO_HANDLE);

  const fioCryptoHandleObj = useSelector(state =>
    currentFioAddress(state, fioCryptoHandleName),
  );
  const fioWallets = useSelector(fioWalletsSelector);

  usePublicAddresses(fioCryptoHandleName);

  useGetMappedErrorRedirect(fioCryptoHandleName);

  const { name, publicAddresses = [], walletPublicKey = '' } =
    fioCryptoHandleObj || {};

  const fioWallet = fioWallets.find(
    ({ publicKey }) => publicKey === walletPublicKey,
  );

  const [results, setResultsData] = useState<LinkActionResult>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [submitData, setSubmitData] = useState<SubmitDataProps>(null);
  const [bundleCost, changeBundleCost] = useState<number>(0);

  const onSubmit = (values: AddTokenValues) => {
    setSubmitData({
      ...values,
      name,
    });
  };

  const onSuccess = (result: LinkActionResult) => {
    setResultsData(result);
    setSubmitData(null);
    setProcessing(false);
  };

  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };

  const onBack = (formProps: FormRenderProps<AddTokenValues>) => {
    const { form } = formProps;
    form.reset();
    setResultsData(null);
    changeBundleCost(0);
  };

  const onRetry = (resultsData: LinkActionResult) => {
    setSubmitData({
      name,
      tokens: resultsData.connect.failed,
    });
  };

  const validate = (values: AddTokenValues) =>
    validation(values, publicAddresses);
  const validateToken = (
    token: PublicAddressDoublet,
    values: AddTokenValues,
  ) => {
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
    validate,
    validateToken,
    publicAddresses,
  };
};
