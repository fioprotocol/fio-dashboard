import React from 'react';

import ContractAddressField from './components/ContractAddressField';
import GenericNftValidationField, {
  FIELDS_NAMES,
} from './components/GenericNftValidationField';
import { renderContractAddressTitle } from './components/NftListTitle/ContractAddressTitle';
import GenericTitleComponent from './components/NftListTitle/GenericTitleComponent';
import GenericNftItemResult, {
  renderContractAddressItem,
} from './components/NftItemResult/GenericNftItemResult';

import { RenderItem, RenderTitle, ValidationOption } from './components/types';

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
};

const renderFioAddressTitle: RenderTitle = searchParams => (
  <GenericTitleComponent title="FIO Address" value={searchParams.fioAddress} />
);

const renderFioAddressItem: RenderItem = (resultItem, searchParams) => (
  <GenericNftItemResult
    titles={[TITLE_NAME.chainCode, TITLE_NAME.tokenId]}
    resultItem={resultItem}
    searchParams={searchParams}
  />
);

const renderHashTitle: RenderTitle = values => (
  <GenericTitleComponent title="Hash" value={values.hash} />
);

const renderHashItem: RenderItem = (resultItem, searchParams) => (
  <GenericNftItemResult
    titles={[
      TITLE_NAME.fioAddress,
      TITLE_NAME.chainCode,
      TITLE_NAME.contractAddress,
    ]}
    resultItem={resultItem}
    searchParams={searchParams}
  />
);

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
  //image: {
  //   id: 'image',
  //   name: 'Image',
  //   field: <div>Image</div>,
  //   resultsTitle: (values: any) => <div></div>,
  //   resultsItem: (resultItem: NFTTokenDoublet) => <div></div>,
  // }, // todo: set image upload hash method
};

export const optionsList = Object.values(OPTIONS).map(({ id, name }) => ({
  id,
  name,
}));
