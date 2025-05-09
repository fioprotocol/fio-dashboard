/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace JSX {
  interface IntrinsicElements {
    'lottie-player': any;
  }
}
interface Window {
  ethereum?: any;
  bitpay: any;
  fioCorsFixfetch: (
    input: RequestInfo | URL,
    init?: RequestInit,
  ) => Promise<Response>;
}

declare module 'edge-currency-accountbased';
declare module 'crypto-browserify';
declare module 'ledgerjs-hw-app-fio';
