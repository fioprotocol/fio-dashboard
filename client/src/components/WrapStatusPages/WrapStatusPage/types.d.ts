import { WrapStatusWrapItem } from '../../types';

export type PageProps = {
  isBurned?: boolean;
  isWrap: boolean;
  isTokens: boolean;
  loading: boolean;
  maxDataItemsCount: number;
  data: WrapStatusWrapItem[];
  getData: (limit?: number, offset?: number) => Promise<void>;
};
