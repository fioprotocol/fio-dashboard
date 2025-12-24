import { WrapStatusWrapItem } from '../../../types';
import { OperationType, AssetType, ChainCode } from './constants';

export type PageProps = {
  operationType: OperationType;
  assetType: AssetType;
  chainCode: ChainCode | null;
  loading: boolean;
  maxDataItemsCount: number;
  data: WrapStatusWrapItem[];
  getData: (limit?: number, offset?: number) => Promise<void>;
};

// Legacy props support - for gradual migration
export type LegacyPageProps = {
  isBurned?: boolean;
  isWrap: boolean;
  isTokens: boolean;
  loading: boolean;
  maxDataItemsCount: number;
  data: WrapStatusWrapItem[];
  getData: (limit?: number, offset?: number) => Promise<void>;
};
