import { WrapStatusWrapItem } from '../../types';

export type PageProps = {
  loading: boolean;
  wrapTokensListCount: number;
  wrapTokensList: WrapStatusWrapItem[];
  wrapDomainsListCount: number;
  wrapDomainsList: WrapStatusWrapItem[];
  unwrapTokensListCount: number;
  unwrapTokensList: WrapStatusWrapItem[];
  unwrapDomainsListCount: number;
  unwrapDomainsList: WrapStatusWrapItem[];
  getWrapTokensList: (limit?: number, offset?: number) => Promise<void>;
  getWrapDomainsList: (limit?: number, offset?: number) => Promise<void>;
  getUnwrapDomainsList: (limit?: number, offset?: number) => Promise<void>;
  getUnwrapTokensList: (limit?: number, offset?: number) => Promise<void>;
};
