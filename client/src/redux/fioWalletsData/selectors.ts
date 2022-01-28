import { ReduxState } from '../init';
import { prefix } from './actions';

export const fioWalletsData = (state: ReduxState) => state[prefix].walletsData;
