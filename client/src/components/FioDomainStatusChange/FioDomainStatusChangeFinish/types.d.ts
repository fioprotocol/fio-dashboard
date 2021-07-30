import { History } from 'history';

export type HistoryLocationStateProps = {
  location: {
    state: {
      feeCollected: {
        costFio: number;
        costUsdc: number;
      };
      name: string;
      changedStatus: string;
      error?: string;
    };
  };
};

export type ComponentProps = {
  history: History;
} & HistoryLocationStateProps;
