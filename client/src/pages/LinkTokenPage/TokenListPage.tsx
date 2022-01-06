import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { Redirect } from 'react-router-dom';
import classnames from 'classnames';

import NotificationBadge from '../../components/NotificationBadge';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import PseudoModalContainer from '../../components/PseudoModalContainer';

import { ROUTES } from '../../constants/routes';
import FioName from '../../components/common/FioName/FioName';

import PublicAddresses from './components/PublicAddresses';
import InfoMessage from './components/InfoMessage';
import ActionButtons from './components/ActionButtons';

import { usePublicAddresses } from '../../util/hooks';

import { FioAddressWithPubAddresses } from '../../types';

import classes from './styles/TokenList.module.scss';

type Props = {
  currentFioAddress: FioAddressWithPubAddresses;
  showTokenListInfoBadge: boolean;
  toggleTokenListInfoBadge: (enabled: boolean) => void;
  loading: boolean;
};

const ListToken: React.FC<Props & RouteComponentProps> = props => {
  const {
    currentFioAddress: { name, publicAddresses },
    match: { url },
    loading,
    showTokenListInfoBadge,
    toggleTokenListInfoBadge,
  } = props;

  usePublicAddresses(name);

  const [showBadge, toggleShowBadge] = useState(false);

  const onClose = () => toggleTokenListInfoBadge(false);

  useEffect(() => {
    // show info badge if only FIO linked
    toggleShowBadge(
      showTokenListInfoBadge &&
        publicAddresses != null &&
        publicAddresses.length === 0,
    );
  }, [publicAddresses, showTokenListInfoBadge]);

  if (!name) return <Redirect to={{ pathname: ROUTES.FIO_ADDRESSES }} />;

  return (
    <PseudoModalContainer
      title="FIO Address Linking"
      link={ROUTES.FIO_ADDRESSES}
      hasAutoWidth={true}
    >
      <div className={classes.container}>
        <NotificationBadge
          message={<InfoMessage />}
          noDash={true}
          onClose={onClose}
          show={showBadge}
          title="What is Wallet Linking?"
          type={BADGE_TYPES.INFO}
        />
        <div
          className={classnames(classes.actionContainer, classes.columnMobile)}
        >
          <FioName name={name} />
          <ActionButtons url={url} isDisabled={publicAddresses.length === 0} />
        </div>
        <h5 className={classnames(classes.subtitle, classes.hasMargin)}>
          Linked Tokens
        </h5>
        <PublicAddresses publicAddresses={publicAddresses} loading={loading} />
      </div>
    </PseudoModalContainer>
  );
};

export default ListToken;
