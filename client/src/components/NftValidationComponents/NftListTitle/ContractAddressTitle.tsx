import React from 'react';
import GenericTitleComponent from './GenericTitleComponent';

import { TITLE_NAME } from '../../../pages/NftValidationPage/constant';
import classes from './ContractAddressTitle.module.scss';

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
