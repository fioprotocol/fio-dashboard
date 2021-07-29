import { PageNameType } from '../../../types';

export type FioTransferFinishProps = {
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
