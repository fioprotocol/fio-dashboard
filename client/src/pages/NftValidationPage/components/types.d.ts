import React from 'react';
import { NFTTokenDoublet } from '../../../types';

export type NftValidationFormValues = {
  contractAddress?: string;
  tokenId?: string;
  hash?: string;
  fioAddress?: string;
  chainCode?: string;
};

export type RenderTitle = (
  searchParams: NftValidationFormValues,
) => React.ReactNode;

export type RenderItem = (
  resultItem: NFTTokenDoublet,
  searchParams: NftValidationFormValues,
) => React.ReactNode;

export type ValidationOption = {
  id: string;
  name: string;
  field: React.ReactNode;
  resultsTitle: RenderTitle;
  resultsItem: RenderItem;
};
