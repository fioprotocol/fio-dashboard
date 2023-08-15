import React from 'react';
import classnames from 'classnames';

import NotificationBadge from '../../components/NotificationBadge';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import TokenBadge from '../../components/Badges/TokenBadge/TokenBadge';

import { ROUTES } from '../../constants/routes';
import FioName from '../../components/common/FioName/FioName';

import PublicAddresses from './components/PublicAddresses';
import InfoMessage from './components/InfoMessage';
import ActionButtons from './components/ActionButtons';

import { useContext } from './TokenListPageContext';

import classes from './TokenList.module.scss';

const TokenListPage: React.FC = () => {
  const {
    loading,
    fioCryptoHandlePub,
    fioCryptoHandleName,
    publicAddresses,
    search,
    showBadge,
    onClose,
  } = useContext();

  return (
    <PseudoModalContainer
      title="FIO Handle Linking"
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
        <div className="mt-4">
          <FioName name={fioCryptoHandleName} />
        </div>
        <h5 className={classnames(classes.subtitle, classes.hasMargin)}>
          FIO Public Address
        </h5>
        <div className={classes.fioPubContainer}>
          <TokenBadge badgeType={BADGE_TYPES.BLACK} {...fioCryptoHandlePub} />
        </div>
        <div
          className={classnames(classes.actionContainer, classes.columnMobile)}
        >
          <h5 className={classnames(classes.subtitle, classes.hasMargin)}>
            Linked Tokens
          </h5>
          <ActionButtons
            search={search}
            isDisabled={publicAddresses?.length === 0}
          />
        </div>

        <h5 className={classnames(classes.subtitle, classes.infoSubtitle)}>
          <span className="boldText">Hint:</span>{' '}
          <span className={classes.asterisk}>*</span> maps all tokens on a chain
        </h5>
        <PublicAddresses publicAddresses={publicAddresses} loading={loading} />
      </div>
    </PseudoModalContainer>
  );
};

export default TokenListPage;
