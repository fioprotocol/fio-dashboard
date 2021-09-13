import { prefix } from './actions';
import { ReduxState } from './types';

export const nftSignatures = (state: ReduxState) => state[prefix].list;
