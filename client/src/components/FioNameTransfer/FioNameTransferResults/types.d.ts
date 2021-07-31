import { PageNameType } from '../../../types';

export type FioTransferResultsProps = {
  pageName: PageNameType;
  resetTransactionResult: () => void;
};

export type HistoryLocationStateProps = {
  location: {
    state: {
      feeCollected: {
        costFio: number;
        costUsdc: number;
      };
      name: string;
      publicKey: string;
      error?: string;
    };
  };
};
