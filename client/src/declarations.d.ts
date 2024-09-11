/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace JSX {
  interface IntrinsicElements {
    'lottie-player': any;
  }
}

interface Window {
  initGeetest?: any;
  ethereum?: any;
  bitpay: any;
  fioCorsFixfetch: (
    input: RequestInfo | URL,
    init?: RequestInit,
  ) => Promise<Response>;
}

// declare module '@fioprotocol/fiosdk';
// declare module '@fioprotocol/fiosdk/lib/transactions/Transactions';
// declare module '@fioprotocol/fiosdk/lib/entities/EndPoint';
// declare module '@fioprotocol/fiosdk/lib/utils/constants';
// declare module '@fioprotocol/fiosdk/lib/utils/validation';
declare module 'edge-currency-accountbased';
declare module 'crypto-browserify';
declare module 'ledgerjs-hw-app-fio';
