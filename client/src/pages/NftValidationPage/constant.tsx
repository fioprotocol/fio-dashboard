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

const TITLE_NAME = {
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
};

export const OPTIONS: {
  [key: string]: {
    name: string;
    field: React.ReactNode;
    resultsTitle: (values: NftValidationFormValues) => React.ReactNode;
    resultsItem: (resultitem: NFTTokenDoublet) => React.ReactNode;
  };
} = {
  contractAddress: {
    name: 'Contract Address',
    field: <ContractAddressField />,
    resultsTitle: values => <ContractAddressTitle values={values} />,
    resultsItem: resultItem => (
      <GenericNftItemResult
        titles={[TITLE_NAME.fioAddress]}
        resultItem={resultItem}
      />
    ),
  },
  fioAddress: {
    name: 'FIO Address',
    field: (
      <GenericNftValidationField
        fieldName={FIELDS_NAMES.FIO_ADDRESS}
        isMaxField={true}
      />
    ),
    resultsTitle: values => (
      <GenericTitleComponent title="FIO Address" value={values.fioAddress} />
    ),
    resultsItem: resultItem => (
      <GenericNftItemResult
        titles={[TITLE_NAME.chainCode, TITLE_NAME.tokenId]}
        resultItem={resultItem}
      />
    ),
  },
  hashMedia: {
    name: 'Hash or Media URL',
    field: (
      <GenericNftValidationField
        fieldName={FIELDS_NAMES.HASH_META}
        isMaxField={true}
      />
    ),
    resultsTitle: values => (
      <GenericTitleComponent title="Hash / Media URL" value={values.hashMeta} />
    ),
    resultsItem: resultItem => (
      <GenericNftItemResult
        titles={[
          TITLE_NAME.fioAddress,
          TITLE_NAME.chainCode,
          TITLE_NAME.contractAddress,
        ]}
        resultItem={resultItem}
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

export const optionsList = Object.keys(OPTIONS).map(key => ({
  ...OPTIONS[key],
  id: key,
}));
