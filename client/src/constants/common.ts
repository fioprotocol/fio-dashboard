import { ROUTES } from './routes';
import { NFTTokenItemProps } from '../types';

export const USER_STATUSES = {
  NEW: 'NEW',
  ACTIVE: 'ACTIVE',
  NEW_EMAIL_NOT_VERIFIED: 'NEW_EMAIL_NOT_VERIFIED',
};

export const DEFAULT_WALLET_OPTIONS = {
  name: 'My FIO Wallet',
  fiatCurrencyCode: 'iso:USD',
};
export const FIO_WALLET_TYPE = 'wallet:fio';
export const CONFIRM_PIN_ACTIONS = {
  RECOVERY: 'RECOVERY',
  PURCHASE: 'PURCHASE',
  TRANSFER: 'TRANSFER',
  SET_VISIBILITY: 'SET_VISIBILITY',
  RENEW: 'RENEW',
  SIGN_NFT: 'SIGN_NFT',
  RESEND_EMAIL: 'RESEND_EMAIL',
  DISABLE_PASSWORD_RECOVERY: 'DISABLE_PASSWORD_RECOVERY',
  CREATE_WALLET: 'CREATE_WALLET',
  IMPORT_WALLET: 'IMPORT_WALLET',
  SEND: 'SEND',
  UPDATE_EMAIL: 'UPDATE_EMAIL',
  DISABLE_TWO_FACTOR: 'DISABLE_TWO_FACTOR',
  ENABLE_TWO_FACTOR: 'ENABLE_TWO_FACTOR',
  TWO_FACTOR_REQUEST: 'TWO_FACTOR_REQUEST',
  SHOW_BACKUP_CODE: 'SHOW_BACKUP_CODE',
  ADD_TOKEN: 'ADD_TOKEN',
  DELETE_TOKEN: 'DELETE_TOKEN',
  EDIT_TOKEN: 'EDIT_TOKEN',
  DETAILED_FIO_REQUEST: 'DETAILED_FIO_REQUEST',
  REJECT_FIO_REQUEST: 'REJECT_FIO_REQUEST',
  STAKE: 'STAKE',
  UNSTAKE: 'UNSTAKE',
};

export const ADDRESS = 'address';
export const DOMAIN = 'domain';

export const DOMAIN_STATUS = {
  PRIVATE: 'private',
  PUBLIC: 'public',
};

export const MANAGE_PAGE_REDIRECT = {
  address: ROUTES.FIO_ADDRESSES,
  domain: ROUTES.FIO_DOMAINS,
};

export const REF_ACTIONS = {
  SIGNNFT: 'SIGNNFT',
};

export const REF_ACTIONS_TO_ROUTES = {
  [REF_ACTIONS.SIGNNFT]: ROUTES.REF_SIGN_NFT,
};

export const REF_FLOW_STEPS = {
  INIT: 'INIT',
  CREATE_ACCOUNT: 'CREATE_ACCOUNT',
  REGISTRATION: 'REGISTRATION',
  ACTION: 'ACTION',
  FINISH: 'FINISH',
};

export const NFT_TOKEN_ITEM_PROPS_ORDER: NFTTokenItemProps[] = [
  'fioAddress',
  'chainCode',
  'tokenId',
  'contractAddress',
  'hash',
  'url',
  'metadata',
];

export const WALLET_CREATED_FROM = {
  EDGE: 'EDGE',
  LEDGER: 'LEDGER',
};

export const NFT_CHAIN_CODE_LIST = [
  { id: 'ALGO', name: 'Algorand' },
  { id: 'BSC', name: 'Binance Smart Chain' },
  { id: 'ADA', name: 'Cardano' },
  { id: 'DGB', name: 'DigiByte' },
  { id: 'EOS', name: 'EOS' },
  { id: 'ETH', name: 'Ethereum' },
  { id: 'FLOW', name: 'Flow' },
  { id: 'MATIC', name: 'Polygon' },
  { id: 'SOL', name: 'Solana' },
  { id: 'XTZ', name: 'TEZOS' },
  { id: 'THETA', name: 'THETA' },
  { id: 'TRX', name: 'TRON' },
  { id: 'WAX', name: 'WAXP' },
];

export const CHAIN_CODES = {
  FIO: 'FIO',
  BTC: 'BTC',
  ETH: 'ETH',
};

export const FIO_DATA_TRANSACTION_LINK = {
  [CHAIN_CODES.FIO]: process.env.REACT_APP_FIO_BLOCKS_TX_URL,
  [CHAIN_CODES.BTC]: 'https://blockchair.com/bitcoin/transaction/',
  [CHAIN_CODES.ETH]: 'https://etherscan.io/tx/',
};

export const CHAIN_CODE_LIST = [
  {
    id: CHAIN_CODES.ETH,
    name: 'Ethereum',
    tokens: [
      {
        id: 'ETH',
        name: 'Ethereum',
      },
      {
        id: 'REP',
        name: 'Augur',
      },
      {
        id: 'REPV2',
        name: 'Augur v2',
      },
      {
        id: 'HERC',
        name: 'Hercules',
      },
      {
        id: 'DAI',
        name: 'Dai Stablecoin',
      },
      {
        id: 'SAI',
        name: 'Sai Stablecoin',
      },
      {
        id: 'WINGS',
        name: 'Wings',
      },
      {
        id: 'USDT',
        name: 'Tether',
      },
      {
        id: 'IND',
        name: 'Indorse',
      },
      {
        id: 'HUR',
        name: 'Hurify',
      },
      {
        id: 'ANTV1',
        name: 'Aragon',
      },
      {
        id: 'ANT',
        name: 'Aragon',
      },
      {
        id: 'BAT',
        name: 'Basic Attention Token',
      },
      {
        id: 'BNT',
        name: 'Bancor',
      },
      {
        id: 'GNT',
        name: 'Golem (old)',
      },
      {
        id: 'KNC',
        name: 'Kyber Network',
      },
      {
        id: 'POLY',
        name: 'Polymath Network',
      },
      {
        id: 'STORJ',
        name: 'Storj',
      },
      {
        id: 'USDC',
        name: 'USD Coin',
      },
      {
        id: 'USDS',
        name: 'StableUSD',
      },
      {
        id: 'TUSD',
        name: 'TrueUSD',
      },
      {
        id: 'ZRX',
        name: '0x',
      },
      {
        id: 'GNO',
        name: 'Gnosis',
      },
      {
        id: 'OMG',
        name: 'OmiseGO',
      },
      {
        id: 'NMR',
        name: 'Numeraire',
      },
      {
        id: 'MKR',
        name: 'Maker',
      },
      {
        id: 'GUSD',
        name: 'Gemini Dollar',
      },
      {
        id: 'PAX',
        name: 'Paxos',
      },
      {
        id: 'SALT',
        name: 'SALT',
      },
      {
        id: 'MANA',
        name: 'Decentraland',
      },
      {
        id: 'NEXO',
        name: 'Nexo',
      },
      {
        id: 'FUN',
        name: 'FunFair',
      },
      {
        id: 'KIN',
        name: 'Kin',
      },
      {
        id: 'LINK',
        name: 'Chainlink',
      },
      {
        id: 'BRZ',
        name: 'BRZ Token',
      },
      {
        id: 'CREP',
        name: 'Compound Augur',
      },
      {
        id: 'CUSDC',
        name: 'Compound USDC',
      },
      {
        id: 'CETH',
        name: 'Compound ETH',
      },
      {
        id: 'CBAT',
        name: 'Compound BAT',
      },
      {
        id: 'CZRX',
        name: 'Compound ZRX',
      },
      {
        id: 'CWBTC',
        name: 'Compound WBTC',
      },
      {
        id: 'CSAI',
        name: 'Compound SAI',
      },
      {
        id: 'CDAI',
        name: 'Compound DAI',
      },
      {
        id: 'ETHBNT',
        name: 'BNT Smart Token Relay',
      },
      {
        id: 'OXT',
        name: 'Orchid',
      },
      {
        id: 'COMP',
        name: 'Compound',
      },
      {
        id: 'MET',
        name: 'Metronome',
      },
      {
        id: 'SNX',
        name: 'Synthetix Network',
      },
      {
        id: 'SUSD',
        name: 'Synthetix USD',
      },
      {
        id: 'SBTC',
        name: 'Synthetix BTC',
      },
      {
        id: 'AAVE',
        name: 'Aave',
      },
      {
        id: 'AYFI',
        name: 'Aave Interest Bearing YFI',
      },
      {
        id: 'ALINK',
        name: 'Aave Interest Bearing LINK',
      },
      {
        id: 'ADAI',
        name: 'Aave Interest Bearing Dai',
      },
      {
        id: 'ABAT',
        name: 'Aave Interest Bearing BAT',
      },
      {
        id: 'AWETH',
        name: 'Aave Interest Bearing Wrapped ETH',
      },
      {
        id: 'AWBTC',
        name: 'Aave Interest Bearing Wrapped BTC',
      },
      {
        id: 'ASNX',
        name: 'Aave Interest Bearing SNX',
      },
      {
        id: 'AREN',
        name: 'Aave Interest Bearing REN',
      },
      {
        id: 'AUSDT',
        name: 'Aave Interest Bearing USDT',
      },
      {
        id: 'AMKR',
        name: 'Aave Interest Bearing MKR',
      },
      {
        id: 'AMANA',
        name: 'Aave Interest Bearing MANA',
      },
      {
        id: 'AZRX',
        name: 'Aave Interest Bearing ZRX',
      },
      {
        id: 'AKNC',
        name: 'Aave Interest Bearing KNC',
      },
      {
        id: 'AUSDC',
        name: 'Aave Interest Bearing USDC',
      },
      {
        id: 'ASUSD',
        name: 'Aave Interest Bearing SUSD',
      },
      {
        id: 'AUNI',
        name: 'Aave Interest Bearing UNI',
      },
      {
        id: 'WBTC',
        name: 'Wrapped Bitcoin',
      },
      {
        id: 'YFI',
        name: 'Yearn Finance',
      },
      {
        id: 'CRV',
        name: 'Curve DAO Token',
      },
      {
        id: 'BAL',
        name: 'Balancer',
      },
      {
        id: 'SUSHI',
        name: 'Sushi Token',
      },
      {
        id: 'UMA',
        name: 'UMA',
      },
      {
        id: 'BADGER',
        name: 'Badger',
      },
      {
        id: 'IDLE',
        name: 'Idle Finance',
      },
      {
        id: 'NXM',
        name: 'Nexus Mutual',
      },
      {
        id: 'CREAM',
        name: 'Cream',
      },
      {
        id: 'PICKLE',
        name: 'PickleToken',
      },
      {
        id: 'CVP',
        name: 'Concentrated Voting Power',
      },
      {
        id: 'ROOK',
        name: 'Keeper DAO',
      },
      {
        id: 'DOUGH',
        name: 'PieDAO',
      },
      {
        id: 'COMBO',
        name: 'COMBO',
      },
      {
        id: 'INDEX',
        name: 'INDEX COOP',
      },
      {
        id: 'WETH',
        name: 'Wrapped ETH',
      },
      {
        id: 'RENBTC',
        name: 'Ren BTC',
      },
      {
        id: 'RENBCH',
        name: 'Ren BCH',
      },
      {
        id: 'RENZEC',
        name: 'Ren ZEC',
      },
      {
        id: 'TBTC',
        name: 'tBTC',
      },
      {
        id: 'DPI',
        name: 'DefiPulse Index',
      },
      {
        id: 'YETI',
        name: 'Yearn Ecosystem Token Index',
      },
      {
        id: 'BAND',
        name: 'BAND',
      },
      {
        id: 'REN',
        name: 'Ren',
      },
      {
        id: 'AMPL',
        name: 'Ampleforth',
      },
      {
        id: 'OCEAN',
        name: 'OCEAN',
      },
      {
        id: 'GLM',
        name: 'Golem',
      },
      {
        id: 'UNI',
        name: 'Uniswap',
      },
    ],
  },
  { id: CHAIN_CODES.BTC, name: 'Bitcoin' },
  { id: 'ALGO', name: 'Algorand' },
  { id: 'BSC', name: 'Binance Smart Chain' },
  { id: 'ADA', name: 'Cardano' },
  { id: 'DGB', name: 'DigiByte' },
  { id: 'EOS', name: 'EOS' },
  { id: 'FLOW', name: 'Flow' },
  { id: 'MATIC', name: 'Polygon' },
  { id: 'SOL', name: 'Solana' },
  { id: 'XTZ', name: 'TEZOS' },
  { id: 'THETA', name: 'THETA' },
  { id: 'TRX', name: 'TRON' },
  { id: 'WAX', name: 'WAXP' },
];

export const DEFAULT_TEXT_TRUNCATE_LENGTH = 5;

export const US_LOCALE = 'en-US';
