import { CONFIRM_PIN_ACTIONS } from './common';
import { ROUTES } from './routes';

export const CONTAINED_FLOW_ACTIONS = {
  SIGNNFT: CONFIRM_PIN_ACTIONS.SIGN_NFT,
};

export const CONTAINED_FLOW_ACTIONS_TO_ROUTES = {
  [CONTAINED_FLOW_ACTIONS.SIGNNFT]: ROUTES.CONTAINED_FLOW_SIGN_NFT,
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
    'please add your FIO Crypto Handle again, and purchase in order to complete your NFT signing',
};

export const CONTAINED_FLOW_SUBTITLES = {
  [CONTAINED_FLOW_ACTIONS.SIGNNFT]: 'Sign in to complete signing your NFT',
};

export const CONTAINED_FLOW_ACTION_TEXT = {
  [CONTAINED_FLOW_ACTIONS.SIGNNFT]:
    'All you have to do is add a username, select a domain and sign the NFT',
};
