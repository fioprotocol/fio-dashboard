import { PageNameType } from '../../../types';

export type FioTransferResultsProps = {
  pageName: PageNameType;
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
