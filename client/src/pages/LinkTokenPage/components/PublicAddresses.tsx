import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import TokenBadge from '../../../components/Badges/TokenBadge/TokenBadge';
import TokenBadgeMobile from '../../../components/Badges/TokenBadge/TokenBadgeMobile';
import InfoBadge from '../../../components/Badges/InfoBadge/InfoBadge';

import { useCheckIfDesktop } from '../../../screenType';

import { PublicAddressDoublet } from '../../../types';

import classes from '../styles/TokenList.module.scss';

type Props = {
  publicAddresses: PublicAddressDoublet[] | null;
  loading: boolean;
};

const PublicAddresses: React.FC<Props> = props => {
  const { publicAddresses, loading } = props;

  const isDesktop = useCheckIfDesktop();

  if (loading)
    return <FontAwesomeIcon icon="spinner" spin className={classes.spinner} />;

  if (!publicAddresses)
    return (
      <div className={classes.infoBadge}>
        <InfoBadge
          title="No Linked Tokens"
          message="You have no linked Public Addresses for this FIO Address"
        />
      </div>
    );

  return (
    <div className={classes.publicAddresses}>
      {publicAddresses.map(pubAddress =>
        isDesktop ? (
          <TokenBadge {...pubAddress} key={pubAddress.publicAddress} />
        ) : (
          <TokenBadgeMobile {...pubAddress} key={pubAddress.publicAddress} />
        ),
      )}
    </div>
  );
};

export default PublicAddresses;
