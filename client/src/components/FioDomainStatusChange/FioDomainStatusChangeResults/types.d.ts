import { History } from 'history';
import { RouteComponentProps } from 'react-router-dom';

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
  resetTransactionResult: () => void;
} & HistoryLocationStateProps &
  RouteComponentProps;
