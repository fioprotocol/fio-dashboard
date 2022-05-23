import { createSelector } from 'reselect';

import { prefix } from './actions';

import { ReduxState } from '../../redux/init';
import { ContainedFlowQueryParams } from '../../types';

export const containedFlowQueryParams = (
  state: ReduxState,
): ContainedFlowQueryParams | null => state[prefix].params;
export const containedFlowLinkError = (state: ReduxState): string | null =>
  state[prefix].containedFlowLinkError;
export const containedFlowStep = (state: ReduxState): string =>
  state[prefix].step;

export const isContainedFlow = createSelector(
  containedFlowQueryParams,
  params => !!params,
);
