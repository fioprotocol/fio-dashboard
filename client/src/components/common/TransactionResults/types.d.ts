import { PageNameType } from '../../../types';

export type ResultsData = {
  feeCollected: {
    costFio: number;
    costUsdc: number;
  };
  name: string;
  publicKey?: string;
  changedStatus?: string;
  error?: string;
};

export type ResultsProps = {
  pageName?: PageNameType;
  title: string;
  actionName: string;
  results: ResultsData;
  onClose: () => void;
  onRetry: () => void;
  resetTransactionResult: (actionName: string) => void;
};
