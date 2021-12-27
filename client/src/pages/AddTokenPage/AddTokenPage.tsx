import React, { useState, useEffect } from 'react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import ConfirmContainer from '../../components/LinkTokenList/ConfirmContainer';
import AddTokenForm from './copmonents/AddTokenForm';
import EdgeConfirmAction from '../../components/EdgeConfirmAction';

import { CONFIRM_PIN_ACTIONS } from '../../constants/common';
import { validate } from './validation';

import { CONTAINER_NAMES } from '../../components/LinkTokenList/ActionContainer';

import { AddTokenProps, FormValues } from './types';

const AddToken: React.FC<AddTokenProps> = props => {
  const { results, currentFioAddress, remaining, loading } = props;
  const [resultsData, setResultsData] = useState<any | null>(null);
  const [processing, setProcessing] = useState(false);
  const [submitData, setSubmitData] = useState<boolean | null>(null);

  const onSubmit = (values: FormValues) => {
    setSubmitData(true);
  };

  const onSuccess = () => {
    setProcessing(false);
  };

  const onCancel = () => {
    setSubmitData(null);
    setProcessing(false);
  };

  const submit = () => {
    setSubmitData(null);
  };

  // Handle results
  useEffect(() => {
    // todo: set proper results
    setResultsData(results);
  }, [results]);

  if (resultsData)
    return (
      <ConfirmContainer
        results={results}
        containerName={CONTAINER_NAMES.ADD}
        name={currentFioAddress.name}
        remaining={remaining}
        loading={loading}
      />
    );
  return (
    <>
      <EdgeConfirmAction
        onSuccess={onSuccess}
        onCancel={onCancel}
        submitAction={submit}
        data={submitData}
        action={CONFIRM_PIN_ACTIONS.TOKEN_LIST}
        processing={processing}
        setProcessing={setProcessing}
        hideProcessing={true}
      />
      <Form
        onSubmit={onSubmit}
        validate={validate}
        mutators={{
          ...arrayMutators,
        }}
        render={formProps => <AddTokenForm formProps={formProps} {...props} />}
      />
    </>
  );
};

export default AddToken;
