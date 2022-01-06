import React, { useState } from 'react';
import { Form, FormRenderProps } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import AddTokenForm from './copmonents/AddTokenForm';
import EdgeConfirmAction from '../../components/EdgeConfirmAction';

import { validate } from './validation';

import { linkTokens } from '../../api/middleware/fio';
import { minWaitTimeFunction } from '../../utils';

import { CONTAINER_NAMES } from '../../components/LinkTokenList/constants';
import { CONFIRM_PIN_ACTIONS } from '../../constants/common';
import { TOKEN_LINK_MIN_WAIT_TIME } from '../../constants/fio';

import { AddTokenProps, FormValues } from './types';
import {
  PublicAddressDoublet,
  WalletKeys,
  LinkActionResult,
} from '../../types';

const AddToken: React.FC<AddTokenProps> = props => {
  const { currentFioAddress } = props;
  const [resultsData, setResultsData] = useState<LinkActionResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [submitData, setSubmitData] = useState<
    FormValues | PublicAddressDoublet[] | null
  >(null);
  const [bundleCost, changeBundleCost] = useState(0);

  const {
    remaining = 0,
    name,
    edgeWalletId = '',
    walletPublicKey,
  } = currentFioAddress;

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
      fioAddress: name,
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
      console.error(err);
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

  const onRetry = () => {
    setSubmitData(resultsData.connect.failed);
  };

  return (
    <>
      <EdgeConfirmAction
        onSuccess={onSuccess}
        onCancel={onCancel}
        submitAction={submit}
        data={submitData}
        action={CONFIRM_PIN_ACTIONS.ADD_TOKEN}
        processing={processing}
        setProcessing={setProcessing}
        fioWalletEdgeId={edgeWalletId}
      />
      <Form
        onSubmit={onSubmit}
        validate={validate}
        mutators={{
          ...arrayMutators,
        }}
        render={formProps => (
          <AddTokenForm
            formProps={formProps}
            containerName={CONTAINER_NAMES.ADD}
            results={resultsData}
            name={name}
            remaining={remaining}
            bundleCost={bundleCost}
            changeBundleCost={changeBundleCost}
            onBack={() => onBack(formProps)}
            onRetry={onRetry}
            walletPublicKey={walletPublicKey}
          />
        )}
      />
    </>
  );
};

export default AddToken;
