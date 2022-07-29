import { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { DebouncedFunc } from 'lodash';
import { useForm } from 'react-final-form';

import useEffectOnce from '../../hooks/general';

import apis from '../../api';

import { sleep } from '../../utils';

import { ChainCodeProps } from '../../types';
import { ChainAndTokenCodesAutocompleteFieldsProps } from './types';

const DEBOUNCE_TIMEOUT = 500;
const MAX_TOKEN_CODES_LIST_COUNT = 100;
const LOADER_TIMEOUT = 1000;

export const useContext = (
  props: ChainAndTokenCodesAutocompleteFieldsProps,
) => {
  const {
    chainCodeFieldName,
    chainCodeInitialValue,
    tokenCodeFieldName,
  } = props;

  const [chainCodesList, setChainCodesList] = useState<ChainCodeProps[] | []>(
    [],
  );
  const [tokenCodesList, setTokenCodesList] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [forceResetTokenField, toggleForceResetTokenField] = useState<boolean>(
    false,
  );

  const { getFieldState, change: fieldChange } = useForm();

  const { value: chainCodeFieldValue } =
    getFieldState(chainCodeFieldName) || {};
  const { value: tokenCodeFieldValue } =
    getFieldState(tokenCodeFieldName) || {};

  const {
    chainCodeId: selectedChainCodeId,
    chainCodeName: selectedChainCodeName,
    tokens: selectedChainCodeTokens = [],
  } =
    chainCodesList.find(
      chainCodeItem => chainCodeItem.chainCodeId === chainCodeFieldValue,
    ) || {};
  const tokenCodeListHasOneItem =
    !!selectedChainCodeId && selectedChainCodeTokens.length === 1;

  const getChainCodeList = async (chainCodeValue: string) =>
    await apis.chainCode.list(chainCodeValue);

  const handleChainCodeChange: (
    chainCodeValue: string,
  ) => Promise<void> = async (chainCodeValue: string) => {
    setLoading(true);

    const chainCodesList = await getChainCodeList(chainCodeValue);

    setChainCodesList(chainCodesList || []);
    toggleForceResetTokenField(tokenCodeFieldValue);

    await sleep(LOADER_TIMEOUT);
    setLoading(false);
  };

  const onChainCodeClear = () => {
    setChainCodesList([]);
    setTokenCodesList([]);

    toggleForceResetTokenField(tokenCodeFieldValue);
  };

  const onChainCodeChange: DebouncedFunc<(
    chainCodeValue: string,
  ) => Promise<void>> = debounce(handleChainCodeChange, DEBOUNCE_TIMEOUT);

  const setSelectedTokensToList = () => {
    if (selectedChainCodeTokens.length > MAX_TOKEN_CODES_LIST_COUNT)
      return setTokenCodesList([]);
    setTokenCodesList(selectedChainCodeTokens);
  };

  const onTokenCodeChange = (tokenCodeValue: string) => {
    const selectedTokenCodesList = selectedChainCodeTokens || [];

    if (
      !tokenCodeValue &&
      selectedTokenCodesList.length > MAX_TOKEN_CODES_LIST_COUNT
    )
      return setTokenCodesList([]);

    const tokenRegex = new RegExp('^' + tokenCodeValue, 'i');
    const tokenList = selectedTokenCodesList.filter(tokenCodeItem =>
      tokenRegex.test(tokenCodeItem.tokenCodeId),
    );

    setTokenCodesList(tokenList);
  };

  useEffect(() => {
    if (tokenCodeListHasOneItem) {
      fieldChange(tokenCodeFieldName, selectedChainCodeId);
    }
  }, [
    tokenCodeListHasOneItem,
    tokenCodeFieldName,
    selectedChainCodeId,
    selectedChainCodeName,
    fieldChange,
  ]);

  useEffectOnce(() => {
    if (chainCodeInitialValue) {
      handleChainCodeChange(chainCodeInitialValue);
    }
  }, [chainCodeInitialValue, handleChainCodeChange]);

  return {
    chainCodeFieldValue,
    chainCodesList,
    forceResetTokenField,
    loading,
    tokenCodesList,
    onChainCodeChange,
    onChainCodeClear,
    onTokenCodeChange,
    setSelectedTokensToList,
  };
};
