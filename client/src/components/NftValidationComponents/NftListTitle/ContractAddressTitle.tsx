import React from 'react';
import GenericTitleComponent from './GenericTitleComponent';
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
        <GenericTitleComponent title="Chain Code" value={chainCode} />
      </div>
      <div className={classes.titleItem}>
        <GenericTitleComponent
          title="Contract Address"
          value={contractAddress}
        />
      </div>
      <div className={classes.titleItem}>
        <GenericTitleComponent title="Token ID" value={tokenId} />
      </div>
    </div>
  );
};

export default ContractAddressTitle;
