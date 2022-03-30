import React from 'react';

import { NFTTokenDoublet } from '../../../types';

export type NftValidationFormValues = {
  contractAddress?: string;
  tokenId?: string;
  hash?: string;
  fioAddress?: string;
  chainCode?: string;
  image?: string;
  imageUrl?: string;
  imageName?: string;
  url?: string;
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
  hasWarningBadge?: boolean;
  showGroupResults?: boolean;
};

export type TitleNameId = keyof NftValidationFormValues;

type ResultTitleIds = {
  contractAddress?: string;
  tokenId?: string;
  hash?: string;
  fioAddress?: string;
  chainCode?: string;
  url?: string;
};

export type ResultTitleId = keyof ResultTitleIds;
