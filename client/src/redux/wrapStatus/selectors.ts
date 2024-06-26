import { prefix } from './actions';
import { ReduxState } from '../init';

import { WrapStatusWrapItem } from '../../types';

export const loading = (state: ReduxState): boolean => state[prefix].loading;

export const wrapTokensList = (state: ReduxState): WrapStatusWrapItem[] =>
  state[prefix].wrapTokensList;
export const wrapTokensListCount = (state: ReduxState): number =>
  state[prefix].wrapTokensListCount;

export const unwrapTokensList = (state: ReduxState): WrapStatusWrapItem[] =>
  state[prefix].unwrapTokensList;
export const unwrapTokensListCount = (state: ReduxState): number =>
  state[prefix].unwrapTokensListCount;

export const unwrapDomainsList = (state: ReduxState): WrapStatusWrapItem[] =>
  state[prefix].unwrapDomainsList;
export const unwrapDomainsListCount = (state: ReduxState): number =>
  state[prefix].unwrapDomainsListCount;

export const wrapDomainsList = (state: ReduxState): WrapStatusWrapItem[] =>
  state[prefix].wrapDomainsList;
export const wrapDomainsListCount = (state: ReduxState): number =>
  state[prefix].wrapDomainsListCount;

export const burnedDomainsList = (state: ReduxState): WrapStatusWrapItem[] =>
  state[prefix].burnedDomainsList;
export const burnedDomainsListCount = (
  state: ReduxState,
): WrapStatusWrapItem[] => state[prefix].burnedDomainsListCount;
