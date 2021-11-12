import { FeePrice } from '../../../types';

export type ResultsData = {
  feeCollected?: FeePrice;
  name: string;
  publicKey?: string;
  changedStatus?: string;
  other?: any;
  error?: string;
};

export type ResultsProps = {
  title: string;
  hasAutoWidth?: boolean;
  pageName?: string;
  errorType?: string;
  results: ResultsData;
  onClose: () => void;
  onRetry?: () => void;
};

export type ResultsContainerProps = ResultsProps & {
  children: React.ReactNode;
  resetTransactionResult: () => void;
};
