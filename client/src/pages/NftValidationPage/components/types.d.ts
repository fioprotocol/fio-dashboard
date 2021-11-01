import React from 'react';
import { CommonObjectProps, NFTTokenDoublet } from '../../../types';

export type NftValidationFormValues = {
  contractAddress?: string;
  tokenId?: string;
  hash?: string;
  fioAddress?: string;
  chainCode?: string;
  image?: string;
  imageUrl?: string;
  imageName?: string;
};

export type RenderTitle = (searchParams: CommonObjectProps) => React.ReactNode;

export type RenderItem = (
  resultItem: NFTTokenDoublet,
  searchParams: CommonObjectProps,
) => React.ReactNode;

export type ValidationOption = {
  id: string;
  name: string;
  field: React.ReactNode;
  resultsTitle: RenderTitle;
  resultsItem: RenderItem;
};
