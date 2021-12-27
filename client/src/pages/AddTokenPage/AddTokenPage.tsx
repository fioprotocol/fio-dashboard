import React, { useState, useEffect } from 'react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import ConfirmContainer from '../../components/LinkTokenList/ConfirmContainer';
import AddTokenForm from './copmonents/AddTokenForm';
import { validate } from './validation';

import { CONTAINER_NAMES } from '../../components/LinkTokenList/ActionContainer';

import { AddTokenProps } from './types';

const AddToken: React.FC<AddTokenProps> = props => {
  const { results, currentFioAddress, remaining, loading } = props;
  const [resultsData, setResultsData] = useState<any | null>(null);

  const onSubmit = () => {
    // todo: pin confirm
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
    <Form
      onSubmit={onSubmit}
      validate={validate}
      mutators={{
        ...arrayMutators,
      }}
      render={formProps => <AddTokenForm formProps={formProps} {...props} />}
    />
  );
};

export default AddToken;
