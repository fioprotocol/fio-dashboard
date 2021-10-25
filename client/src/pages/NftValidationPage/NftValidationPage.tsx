import React, { useState } from 'react';
import InfoBadge from '../../components/Badges/InfoBadge/InfoBadge';
import NftValidationForm from '../../components/NftValidationComponents/NftValidationForm';
import CustomDropdown from '../../components/NftValidationComponents/CustomDropdown';
import ContractAddressField from '../../components/NftValidationComponents/ContractAddressField';
import GenericNftValidationField, {
  FIELDS_NAMES,
} from '../../components/NftValidationComponents/GenericNftValidationField';

import classes from './NftValidationPage.module.scss';

const OPTIONS = [
  {
    id: 'contractAddress',
    name: 'Contract Address',
    renderField: <ContractAddressField />,
  },
  {
    id: 'fioAddress',
    name: 'FIO Address',
    renderField: (
      <GenericNftValidationField
        fieldName={FIELDS_NAMES.FIO_ADDRESS}
        isMaxField={true}
      />
    ),
  },
  {
    id: 'hashMediaUrl',
    name: 'Hash or Media URL',
    renderField: (
      <GenericNftValidationField
        fieldName={FIELDS_NAMES.HASH_META}
        isMaxField={true}
      />
    ),
  },
  { id: 'image', name: 'Image', renderField: <div>Image</div> }, // todo: set image upload hash method
];

type Props = { nftList: any[] };

const NftValidationPage: React.FC<Props> = props => {
  const [activeOption, setActiveOption] = useState<{
    id?: string;
    name?: string;
    renderField?: React.ReactNode;
  }>({});
  const { nftList } = props;

  const onDropDownChange = (id: string) => {
    setActiveOption(OPTIONS.find(optionItem => optionItem.id === id));
  };

  const onSubmit = () => {};

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>
        <span className="doubleColor boldText">Validate a</span> NFT Signature
      </h1>
      <h3 className={classes.subtitle}>
        You can easily validate a NFT signature through with NFT details, FIO
        address, image or hash/media URL.
      </h3>
      <p className={classes.cta}>
        How would you like to validate the NFT Signature?
      </p>
      <div className={classes.dropdownContainer}>
        <CustomDropdown options={OPTIONS} onChange={onDropDownChange} />
      </div>
      {activeOption.name && (
        <div className={classes.formContainer}>
          <NftValidationForm activeOption={activeOption} onSubmit={onSubmit} />
        </div>
      )}

      {nftList && nftList.length > 0 ? (
        <div>
          {nftList.map(nftItem => (
            <div>{nftItem}</div>
          ))}
        </div>
      ) : (
        activeOption.name && (
          <InfoBadge
            title="No NFT Signatures"
            message={`There are no NFT signatures for this ${activeOption.name}`}
            isOrange={true}
          />
        )
      )}
    </div>
  );
};

export default NftValidationPage;
