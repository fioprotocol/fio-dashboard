declare namespace JSX {
  interface IntrinsicElements {
    'lottie-player': any;
  }
}

interface Window {
  initGeetest?: any;
}

declare module '@fioprotocol/fiosdk';
declare module '@fioprotocol/fiosdk/lib/transactions/Transactions';
declare module '@fioprotocol/fiosdk/lib/entities/EndPoint';
declare module 'edge-currency-accountbased';
declare module 'crypto-browserify';
