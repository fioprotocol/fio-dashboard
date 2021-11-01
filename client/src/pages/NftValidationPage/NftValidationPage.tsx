import React, { useState } from 'react';
import apis from '../../api/index';

import InfoBadge from '../../components/Badges/InfoBadge/InfoBadge';
import NftValidationForm from './components/NftValidationForm';
import CustomDropdown from '../../components/CustomDropdown';

import NftListResults from './components/NftListResults';
import { OPTIONS, optionsList, TITLE_NAME } from './constant';
import { transformNft } from '../../util/fio';
import { minWaitTimeFunction } from '../../utils';

import { NftValidationFormValues, ValidationOption } from './components/types';

import classes from './NftValidationPage.module.scss';
import { CommonObjectProps } from '../../types';

const NftValidationPage: React.FC = () => {
  const [activeOption, setActiveOption] = useState<ValidationOption | null>(
    null,
  );
  const [
    searchParams,
    setSearchParams,
  ] = useState<NftValidationFormValues | null>(null);
  const [results, setResults] = useState(null);
  const [loading, toggleLoading] = useState(false);

  const onDropDownChange = (id: string) => {
    setActiveOption(OPTIONS[id]);
    setSearchParams(null);
    setResults(null);
  };

  const onSubmit = async (values: CommonObjectProps) => {
    toggleLoading(true);
    setResults(null);
    setSearchParams(values);
    const isImage = TITLE_NAME.image.id in values;
    const nftResults = await minWaitTimeFunction(
      () =>
        apis.fio.getNFTs(
          isImage ? { hash: values[TITLE_NAME.hash.id] } : values,
        ),
      2000,
    );
    if (nftResults) setResults(transformNft(nftResults.nfts));
    toggleLoading(false);
  };

  const showInfoBadge =
    searchParams != null && results != null && results.length === 0 && !loading;

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
      {activeOption != null && (
        <div className={classes.formContainer}>
          <NftValidationForm
            activeOption={activeOption}
            onSubmit={onSubmit}
            loading={loading}
          />
        </div>
      )}
      <NftListResults
        searchParams={searchParams}
        activeOption={activeOption}
        results={results}
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
