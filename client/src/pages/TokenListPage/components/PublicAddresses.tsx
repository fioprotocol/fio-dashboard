import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import TokenBadge from '../../../components/Badges/TokenBadge/TokenBadge';
import InfoBadge from '../../../components/Badges/InfoBadge/InfoBadge';

import { genericTokenId } from '../../../util/fio';

import { PublicAddressDoublet } from '../../../types';

import classes from '../TokenList.module.scss';

type Props = {
  publicAddresses: PublicAddressDoublet[] | null;
  loading: boolean;
};

const PublicAddresses: React.FC<Props> = props => {
  const { publicAddresses, loading } = props;

  if (loading)
    return <FontAwesomeIcon icon="spinner" spin className={classes.spinner} />;

  if (!publicAddresses || publicAddresses.length === 0)
    return (
      <div className={classes.infoBadge}>
        <InfoBadge
          title="No Linked Tokens"
          message="You have no linked Public Addresses for this FIO Handle"
        />
      </div>
    );

  return (
    <div className={classes.publicAddresses}>
      {publicAddresses.map(pubAddress => {
        const key = genericTokenId(
          pubAddress.chainCode,
          pubAddress.tokenCode,
          pubAddress.publicAddress,
        );
        return <TokenBadge {...pubAddress} key={key} />;
      })}
    </div>
  );
};

export default PublicAddresses;
