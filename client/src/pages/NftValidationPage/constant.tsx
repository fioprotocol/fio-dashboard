import React from 'react';

import ContractAddressField from './components/ContractAddressField';
import GenericNftValidationField, {
  FIELDS_NAMES,
} from './components/GenericNftValidationField';
import { renderContractAddressTitle } from './components/NftListTitle/ContractAddressTitle';
import {
  renderFioAddressTitle,
  renderHashTitle,
  renderImageTitle,
} from './components/NftListTitle/GenericTitleComponent';

import {
  renderContractAddressItem,
  renderFioAddressItem,
  renderHashItem,
  renderImageItem,
} from './components/NftItemResult/GenericNftItemResult';

import ImageField from './components/ImageField';

import { ValidationOption } from './components/types';

export const TITLE_NAME: { [key: string]: { id: string; name: string } } = {
  contractAddress: {
    name: 'Contract Address',
    id: 'contractAddress',
  },
  chainCode: {
    name: 'Chain Code',
    id: 'chainCode',
  },
  tokenId: {
    name: 'Token ID',
    id: 'tokenId',
  },
  fioAddress: {
    name: 'FIO Address',
    id: 'fioAddress',
  },
  url: {
    name: 'URL',
    id: 'url',
  },
  hash: {
    name: 'Hash',
    id: 'hash',
  },
  image: {
    name: 'Image',
    id: 'image',
  },
  imageName: {
    name: 'Image Name',
    id: 'imageName',
  },
  imageUrl: {
    name: 'Image URL',
    id: 'imageUrl',
  },
};

export const OPTIONS: {
  [key: string]: ValidationOption;
} = {
  contractAddress: {
    id: TITLE_NAME.contractAddress.id,
    name: TITLE_NAME.contractAddress.name,
    field: <ContractAddressField />,
    resultsTitle: renderContractAddressTitle,
    resultsItem: renderContractAddressItem,
  },
  fioAddress: {
    id: TITLE_NAME.fioAddress.id,
    name: TITLE_NAME.fioAddress.name,
    field: (
      <GenericNftValidationField
        fieldName={FIELDS_NAMES.FIO_ADDRESS}
        isMaxField={true}
      />
    ),
    resultsTitle: renderFioAddressTitle,
    resultsItem: renderFioAddressItem,
  },
  hash: {
    id: TITLE_NAME.hash.id,
    name: TITLE_NAME.hash.name,
    field: (
      <GenericNftValidationField
        fieldName={FIELDS_NAMES.HASH}
        isMaxField={true}
      />
    ),
    resultsTitle: renderHashTitle,
    resultsItem: renderHashItem,
  },
  image: {
    id: TITLE_NAME.image.id,
    name: TITLE_NAME.image.name,
    field: <ImageField />,
    resultsTitle: renderImageTitle,
    resultsItem: renderImageItem,
  },
};

export const optionsList = Object.values(OPTIONS).map(({ id, name }) => ({
  id,
  name,
}));
