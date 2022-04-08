import React from 'react';

import GenericTitleComponent from './GenericTitleComponent';

import { TITLE_NAME } from '../constant';
import classes from '../styles/ContractAddressTitle.module.scss';
import { RenderTitle } from './types';

type Props = {
  values: { chainCode?: string; contractAddress?: string; tokenId?: string };
};

const ContractAddressTitle: React.FC<Props> = props => {
  const {
    values: { chainCode, contractAddress, tokenId },
  } = props;
  return (
    <div className={classes.container}>
      <div className={classes.titleItem}>
        <GenericTitleComponent
          title={TITLE_NAME.chainCode.name}
          value={chainCode}
        />
      </div>
      <div className={classes.titleItem}>
        <GenericTitleComponent
          title={TITLE_NAME.contractAddress.name}
          value={contractAddress}
        />
      </div>
      <div className={classes.titleItem}>
        <GenericTitleComponent
          title={TITLE_NAME.tokenId.name}
          value={tokenId}
        />
      </div>
    </div>
  );
};

export default ContractAddressTitle;

export const renderContractAddressTitle: RenderTitle = searchParams => (
  <ContractAddressTitle values={searchParams} />
);
