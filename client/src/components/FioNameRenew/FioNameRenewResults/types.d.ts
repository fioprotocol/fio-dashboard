import { ROUTES } from '../../../constants/routes';
import { PageNameType } from '../../../types';

export type HistoryLocationStateProps = {
  location: {
    state: {
      feeCollected: {
        costFio: number;
        costUsdc: number;
      };
      name: PageNameType;
      link: ROUTES.FIO_ADDRESSES | ROUTES.FIO_DOMAINS;
      error?: string;
    };
  };
};
