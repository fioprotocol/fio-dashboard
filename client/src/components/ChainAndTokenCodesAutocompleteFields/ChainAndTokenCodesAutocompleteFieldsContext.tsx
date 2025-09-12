import { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { useForm } from 'react-final-form';

import useEffectOnce from '../../hooks/general';

import apis from '../../api';

import { sleep } from '../../utils';

import { ASTERISK_SIGN } from '../../constants/common';

import { ChainCodeProps, TokenCodeProps } from '../../types';
import { ChainAndTokenCodesAutocompleteFieldsProps } from './types';

const DEBOUNCE_TIMEOUT = 500;
const MAX_TOKEN_CODES_LIST_COUNT = 100;
const LOADER_TIMEOUT = 1000;

export const useContext = (
  props: ChainAndTokenCodesAutocompleteFieldsProps,
): {
  chainCodeFieldValue: string;
  chainCodesList: ChainCodeProps[];
  forceResetTokenField: boolean;
  loading: boolean;
  tokenCodesList: TokenCodeProps[];
  onChainCodeChange: (chainCodeValue: string) => Promise<void>;
  onChainCodeClear: () => void;
  onBlur: (fieldName: string) => void;
  onTokenCodeChange: (tokenCodeValue: string) => void;
  setSelectedTokensToList: () => void;
} => {
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

  const { getFieldState, change: fieldChange, blur } = useForm();

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

  const onChainCodeChange = debounce(handleChainCodeChange, DEBOUNCE_TIMEOUT);

  const setSelectedTokensToList = () => {
    if (selectedChainCodeTokens.length > MAX_TOKEN_CODES_LIST_COUNT)
      return setTokenCodesList([]);
    setTokenCodesList(selectedChainCodeTokens);
  };

  const onTokenCodeChange = (tokenCodeValue: string) => {
    const selectedTokenCodesList = selectedChainCodeTokens || [];

    if (
      (!tokenCodeValue || tokenCodeValue === ASTERISK_SIGN) &&
      selectedTokenCodesList.length > MAX_TOKEN_CODES_LIST_COUNT
    )
      return setTokenCodesList([]);

    const tokenRegex = new RegExp(
      tokenCodeValue.replace(/^\+/, '\\+').replace(/^\*/, '\\*'),
      'i',
    );
    const tokenList = selectedTokenCodesList.filter(
      tokenCodeItem =>
        tokenRegex.test(tokenCodeItem.tokenCodeId) ||
        tokenRegex.test(tokenCodeItem.tokenCodeName),
    );

    setTokenCodesList(tokenList);
  };

  const onBlur = useCallback(
    (fieldName: string) => {
      blur(fieldName);
    },
    [blur],
  );

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
    onBlur,
    onTokenCodeChange,
    setSelectedTokensToList,
  };
};
