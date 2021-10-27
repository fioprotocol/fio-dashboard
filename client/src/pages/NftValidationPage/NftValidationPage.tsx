import React, { useState } from 'react';
import isEmpty from 'lodash/isEmpty';

import InfoBadge from '../../components/Badges/InfoBadge/InfoBadge';
import NftValidationForm from '../../components/NftValidationComponents/NftValidationForm';
import CustomDropdown from '../../components/CustomDropdown';

import NftListResults from '../../components/NftValidationComponents/NftListResults';
import { OPTIONS, optionsList } from './constant';

import { NftValidationFormValues } from '../../components/NftValidationComponents/types';

import { NFTTokenDoublet } from '../../types';

import classes from './NftValidationPage.module.scss';

type Props = { nftSignatures: NFTTokenDoublet[] };

const NftValidationPage: React.FC<Props> = props => {
  const [activeOption, setActiveOption] = useState<any>({}); // todo: set proper types
  const [searchParams, setSearchParams] = useState({});
  const { nftSignatures } = props;

  const onDropDownChange = (id: string) => {
    setActiveOption(OPTIONS[id]);
    setSearchParams({});
  };

  const onSubmit = (values: NftValidationFormValues) => {
    setSearchParams(values);
  };

  const showInfoBadge = !isEmpty(searchParams) && nftSignatures.length === 0;

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
        <CustomDropdown
          options={optionsList}
          onChange={onDropDownChange}
          placeholder="Select Your Validation Method"
        />
      </div>
      {activeOption && activeOption.name && (
        <div className={classes.formContainer}>
          <NftValidationForm activeOption={activeOption} onSubmit={onSubmit} />
        </div>
      )}
      <NftListResults
        searchParams={searchParams}
        activeOption={activeOption}
        nftSignatures={nftSignatures}
      />
      {showInfoBadge && (
        <div className={classes.badgeContainer}>
          <InfoBadge
            title="No NFT Signatures"
            message={`There are no NFT signatures for this ${activeOption.name}`}
            isOrange={true}
          />
        </div>
      )}
    </div>
  );
};

export default NftValidationPage;
