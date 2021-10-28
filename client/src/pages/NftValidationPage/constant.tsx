import React from 'react';

import ContractAddressField from '../../components/NftValidationComponents/ContractAddressField';
import GenericNftValidationField, {
  FIELDS_NAMES,
} from '../../components/NftValidationComponents/GenericNftValidationField';
import ContractAddressTitle from '../../components/NftValidationComponents/NftListTitle/ContractAddressTitle';
import GenericTitleComponent from '../../components/NftValidationComponents/NftListTitle/GenericTitleComponent';
import GenericNftItemResult from '../../components/NftValidationComponents/NftItemResult/GenericNftItemResult';

import { NftValidationFormValues } from '../../components/NftValidationComponents/types';
import { NFTTokenDoublet } from '../../types';

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

export const OPTIONS: {
  [key: string]: {
    id: string;
    name: string;
    field: React.ReactNode;
    resultsTitle: (searchParams: NftValidationFormValues) => React.ReactNode;
    resultsItem: (
      resultitem: NFTTokenDoublet,
      searchParams: NftValidationFormValues,
    ) => React.ReactNode;
  };
} = {
  contractAddress: {
    id: TITLE_NAME.contractAddress.id,
    name: TITLE_NAME.contractAddress.name,
    field: <ContractAddressField />,
    resultsTitle: searchParams => (
      <ContractAddressTitle values={searchParams} />
    ),
    resultsItem: (resultItem, searchParams) => (
      <GenericNftItemResult
        titles={[TITLE_NAME.fioAddress]}
        resultItem={resultItem}
        searchParams={searchParams}
      />
    ),
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
    resultsTitle: searchParams => (
      <GenericTitleComponent
        title="FIO Address"
        value={searchParams.fioAddress}
      />
    ),
    resultsItem: (resultItem, searchParams) => (
      <GenericNftItemResult
        titles={[TITLE_NAME.chainCode, TITLE_NAME.tokenId]}
        resultItem={resultItem}
        searchParams={searchParams}
      />
    ),
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
    resultsTitle: values => (
      <GenericTitleComponent title="Hash" value={values.hash} />
    ),
    resultsItem: (resultItem, searchParams) => (
      <GenericNftItemResult
        titles={[
          TITLE_NAME.fioAddress,
          TITLE_NAME.chainCode,
          TITLE_NAME.contractAddress,
        ]}
        resultItem={resultItem}
        searchParams={searchParams}
      />
    ),
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
