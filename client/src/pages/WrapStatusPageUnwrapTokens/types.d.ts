import { WrapStatusWrapItem } from '../../types';

export type PageProps = {
  loading: boolean;
  maxDataItemsCount: number;
  data: WrapStatusWrapItem[];
  getData: (limit?: number, offset?: number) => Promise<void>;
};
