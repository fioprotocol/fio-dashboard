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

import { ITEMS_LIMIT, FIO_CHAIN_CODE } from './constants';

import { FioAddressDoublet } from '../../types';

import classes from './styles/TokenList.module.scss';

type Props = {
  currentFioAddress: FioAddressDoublet;
  showTokenListInfoBadge: boolean;
  getAllFioPubAddresses: (
    fioAddress: string,
    limit?: number | null,
    offset?: number | null,
  ) => void;
  toggleTokenListInfoBadge: (enabled: boolean) => void;
  loading: boolean;
};

const ListToken: React.FC<Props & RouteComponentProps> = props => {
  const {
    currentFioAddress: { name, publicAddresses, more },
    match: { url },
    loading,
    showTokenListInfoBadge,
    getAllFioPubAddresses,
    toggleTokenListInfoBadge,
  } = props;

  const [offset, setOffset] = useState(0);
  const [showBadge, toggleShowBadge] = useState(false);

  const onClose = () => toggleTokenListInfoBadge(false);

  const fetchPublicAddresses = (
    limit?: number | null,
    incOffset?: number | null,
  ) => {
    getAllFioPubAddresses(name, limit, incOffset);
  };

  useEffect(() => {
    if (!name) return;
    fetchPublicAddresses(ITEMS_LIMIT, offset);
  }, []);

  useEffect(() => {
    if (more) {
      const incOffset = offset + ITEMS_LIMIT;
      fetchPublicAddresses(ITEMS_LIMIT, incOffset);
      setOffset(incOffset);
    }
  }, [more]);

  useEffect(() => {
    // show info badge if only FIO linked
    toggleShowBadge(
      showTokenListInfoBadge &&
        publicAddresses &&
        publicAddresses.length === 1 &&
        publicAddresses[0].chainCode.toLowerCase() ===
          FIO_CHAIN_CODE.toLowerCase(),
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
          <ActionButtons url={url} />
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
