import { RefProfile } from '../../types';

export type Props = {
  loading: boolean;
  partnersList: RefProfile[];
  getPartnersList: (limit?: number, offset?: number) => Promise<void>;
};
