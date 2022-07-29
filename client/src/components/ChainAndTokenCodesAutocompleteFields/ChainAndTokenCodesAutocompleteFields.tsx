import React from 'react';

import { OnChange } from 'react-final-form-listeners';
import classnames from 'classnames';

import ChainCodeField from '../ChainCodeField/ChainCodeField';

import { useContext } from './ChainAndTokenCodesAutocompleteFieldsContext';

import { ChainAndTokenCodesAutocompleteFieldsProps } from './types';

import classes from './ChainAndTokenCodesAutocompleteFields.module.scss';

export const ChainAndTokenCodesAutocompleteFields: React.FC<ChainAndTokenCodesAutocompleteFieldsProps> = props => {
  const {
    chainCodeFieldLabel = '',
    chainCodeFieldName,
    hasFullWidth,
    hideComponent,
    tokenCodeFieldLabel = '',
    tokenCodeFieldName,
  } = props;

  const {
    chainCodeFieldValue,
    chainCodesList,
    forceResetTokenField,
    loading,
    tokenCodesList,
    onChainCodeChange,
    onChainCodeClear,
    onTokenCodeChange,
    setSelectedTokensToList,
  } = useContext(props);

  if (hideComponent) return null;

  return (
    <>
      <div
        className={classnames(
          classes.chainCodeField,
          hasFullWidth && classes.hasFullWidth,
        )}
      >
        <ChainCodeField
          fieldName={chainCodeFieldName}
          label={chainCodeFieldLabel}
          loading={loading}
          onClear={onChainCodeClear}
          onInputChange={onChainCodeChange}
          optionsList={chainCodesList.map(chainCodeItem => {
            const { chainCodeId: id, chainCodeName: name } = chainCodeItem;
            return { id, name };
          })}
          upperCased={true}
          {...props}
        />
        <OnChange name={chainCodeFieldName}>{setSelectedTokensToList}</OnChange>
      </div>
      <div
        className={classnames(
          classes.tokenCodeField,
          hasFullWidth && classes.hasFullWidth,
        )}
      >
        <ChainCodeField
          disabled={!chainCodeFieldValue}
          fieldName={tokenCodeFieldName}
          forceReset={forceResetTokenField}
          label={tokenCodeFieldLabel}
          onClear={setSelectedTokensToList}
          onInputChange={onTokenCodeChange}
          optionsList={tokenCodesList.map(chainCodeItem => {
            const { tokenCodeId: id, tokenCodeName: name } = chainCodeItem;
            return { id, name };
          })}
          placeholder="Type or Select Token Code"
          upperCased={true}
          {...props}
        />
      </div>
    </>
  );
};
