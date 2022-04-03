import React, { useState } from 'react';

import apis from '../../api/index';

import InfoBadge from '../../components/Badges/InfoBadge/InfoBadge';
import NftValidationForm from './components/NftValidationForm';
import CustomDropdown from '../../components/CustomDropdown';

import NftListResults from './components/NftListResults';
import { OPTIONS, optionsList, TITLE_NAME } from './constant';
import { transformNft } from '../../util/fio';
import { getHash, log } from '../../util/general';
import { minWaitTimeFunction } from '../../utils';
import { URL_REGEXP } from '../../constants/regExps';

import { NftValidationFormValues, ValidationOption } from './components/types';

import classes from './styles/NftValidationPage.module.scss';
import { NFTTokenDoublet } from '../../types';

const NftValidationPage: React.FC = () => {
  const [activeOption, setActiveOption] = useState<ValidationOption | null>(
    null,
  );
  const [
    searchParams,
    setSearchParams,
  ] = useState<NftValidationFormValues | null>(null);
  const [results, setResults] = useState<NFTTokenDoublet[] | null>(null);
  const [loading, toggleLoading] = useState(false);

  const onDropDownChange = (id: string) => {
    setActiveOption(OPTIONS[id]);
    setSearchParams(null);
    setResults(null);
  };

  const getNfts = async (params: NftValidationFormValues) => {
    const nftResults = await minWaitTimeFunction(
      () => apis.fio.getNFTs(params),
      2000,
    );
    if (nftResults) setResults(transformNft(nftResults.nfts));
    toggleLoading(false);
  };

  const onSubmit = async (values: NftValidationFormValues) => {
    toggleLoading(true);
    setResults(null);
    setSearchParams(values);
    let params = values;

    const isImage = TITLE_NAME.image.id in values;
    const { hash } = values;
    if (isImage) params = { hash };

    if (hash && URL_REGEXP.test(hash)) {
      try {
        const file = await fetch(hash)
          .then(res => res.blob())
          .then(blob => new File([blob], 'remoteFile', { type: 'image/*' }));
        const hashFromFile = await getHash(file);
        params = { hash: hashFromFile };
      } catch (e) {
        log.error(e);
      }
    }
    await getNfts(params);
  };

  const showInfoBadge =
    searchParams != null && results != null && results.length === 0 && !loading;

  const showWarningBadge =
    activeOption != null &&
    results != null &&
    activeOption.hasWarningBadge &&
    results.length > 1;

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>
        <span className="doubleColor boldText">Validate a</span> NFT Signature
      </h1>
      <h3 className={classes.subtitle}>
        You can easily validate a NFT signature through with NFT details, FIO
        Crypto Handle, image or hash/media URL.
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
        showWarningBadge={showWarningBadge}
      />
      {showInfoBadge && (
        <div className={classes.badgeContainer}>
          <InfoBadge
            title="No NFT Signatures"
            message={`There are no NFT signatures for this ${activeOption?.name ||
              ''}`}
            isOrange={true}
          />
        </div>
      )}
    </div>
  );
};

export default NftValidationPage;
