import { CONFIRM_PIN_ACTIONS } from './common';
import { ROUTES } from './routes';
import { removeExtraCharactersFromString } from '../util/general';

import {
  ContainedFlowRegTitle,
  ContainedFlowSignNftTitle,
} from '../components/AddressWidget/components/TitleComponent';

export const CONTAINED_FLOW_ACTIONS = {
  SIGNNFT: removeExtraCharactersFromString(CONFIRM_PIN_ACTIONS.SIGN_NFT),
  REG: 'REG',
};

export const CONTAINED_FLOW_ACTIONS_TO_ROUTES = {
  [CONTAINED_FLOW_ACTIONS.SIGNNFT]: ROUTES.FIO_ADDRESS_SIGN,
  [CONTAINED_FLOW_ACTIONS.REG]: ROUTES.FIO_ADDRESSES_SELECTION,
};

export const CONTAINED_FLOW_STEPS = {
  INIT: 'INIT',
  CREATE_ACCOUNT: 'CREATE_ACCOUNT',
  REGISTRATION: 'REGISTRATION',
  ACTION: 'ACTION',
  FINISH: 'FINISH',
};

export const CONTAINED_FLOW_NOTIFICATION_MESSAGES = {
  [CONTAINED_FLOW_ACTIONS.SIGNNFT]:
    'please add your FIO Handle again, and purchase in order to complete your NFT signing',
};

export const CONTAINED_FLOW_LOGIN_SUBTITLES = {
  [CONTAINED_FLOW_ACTIONS.SIGNNFT]: 'Sign in to complete signing your NFT',
};

export const CONTAINED_FLOW_ACTION_TEXT = {
  [CONTAINED_FLOW_ACTIONS.SIGNNFT]:
    'All you have to do is add a username, select a domain and sign the NFT',
};

export const CONTAINED_FLOW_SUBTITLES = {
  [CONTAINED_FLOW_ACTIONS.SIGNNFT]:
    'FIO Protocol have joined forces to create signed NFTs using FIO addresses for authentication',
};

export const CONTAINED_FLOW_TITLES = {
  [CONTAINED_FLOW_ACTIONS.SIGNNFT]: <ContainedFlowSignNftTitle />,
  [CONTAINED_FLOW_ACTIONS.REG]: <ContainedFlowRegTitle />,
};

export const CONTAINED_FLOW_CONTINUE_TEXT = {
  [CONTAINED_FLOW_ACTIONS.SIGNNFT]: 'Sign Your NFT',
};
