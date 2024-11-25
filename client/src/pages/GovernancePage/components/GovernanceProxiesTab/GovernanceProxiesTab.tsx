import { FC } from 'react';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Link } from 'react-router-dom';

import ActionButton from '../../../SettingsPage/components/ActionButton';
import { BADGE_TYPES } from '../../../../components/Badge/Badge';
import Loader from '../../../../components/Loader/Loader';

import { useModalState } from '../../../../hooks/governance';
import { ROUTES } from '../../../../constants/routes';

import { useIsMetaMaskUser } from '../../../../hooks/user';

import { ProxyDetailsModal } from '../ProxyDetailsModal';
import { WarningNotificationBadge } from '../WarningNotificationBadge/WarningNotificationBadge';
import { MyCurrentVotes } from '../MyCurrentVotes';

import { useContext } from './GovernanceProxiesTabContext';

import { GovernancePageContextProps } from '../../types';
import { DetailedProxy } from '../../../../types';

import classes from './GovernanceProxiesTab.module.scss';

export const GovernanceProxiesTab: FC<GovernancePageContextProps> = props => {
  const {
    proxiesLoading,
    listOfProxies,
    onProxySelectChange,
    resetSelectedProxies,
  } = props;

  const { handleProxyVote } = useContext({
    listOfProxies,
    resetSelectedProxies,
  });

  const isMetaMaskUser = useIsMetaMaskUser();

  const modalState = useModalState<DetailedProxy>();

  return (
    <>
      <div className={classes.myVotes}>
        <MyCurrentVotes />
      </div>
      <div className={classes.info}>
        <div className={classes.infoContent}>
          <h5 className={classes.infoTitle}>All Proxies</h5>
          <p className={classes.infoDescription}>
            If you don’t have time to research Block Producers, you can proxy
            your vote to a proxy to allow them to vote on your behalf.
          </p>
          <Link
            to={ROUTES.GOVERNANCE_BLOCK_PRODUCERS}
            className={classes.infoLink}
          >
            Would you rather vote directly?
          </Link>
        </div>
        <ActionButton
          className={classes.infoActionButton}
          title="Proxy Now"
          isIndigo
          disabled={proxiesLoading || isMetaMaskUser}
          onClick={handleProxyVote}
        />
      </div>
      <WarningNotificationBadge
        show={isMetaMaskUser}
        title="Warning"
        type={BADGE_TYPES.ERROR}
        message="Voting via MetaMask is not supported at this time."
      />
      <div className={classes.proxiesList}>
        {proxiesLoading ? (
          <Loader />
        ) : listOfProxies.length === 0 ? null : (
          listOfProxies.map(proxyItem => (
            <div key={proxyItem.id} className={classes.proxyBlock}>
              <div className={classes.proxyBlockContent}>
                <div
                  className={classes.proxyBlockRadio}
                  onClick={() => onProxySelectChange(proxyItem.id)}
                >
                  {proxyItem.checked ? (
                    <RadioButtonCheckedIcon />
                  ) : (
                    <RadioButtonUncheckedIcon />
                  )}
                </div>
                <div className={classes.proxyBlockData}>
                  <p className={classes.proxyDataItem}>{proxyItem.owner}</p>
                  <p className={classes.proxyDataItem}>
                    FIO Handle: {proxyItem.fioAddress}
                  </p>
                </div>
              </div>
              <ActionButton
                className={classes.proxyBlockActionButton}
                title="View"
                isIndigo
                onClick={() => modalState.open(proxyItem)}
              />
            </div>
          ))
        )}
      </div>
      <ActionButton
        className={classes.proxyNowActionButton}
        title="Proxy Now"
        isIndigo
        disabled={proxiesLoading || isMetaMaskUser}
        onClick={handleProxyVote}
      />
      {modalState.data && (
        <ProxyDetailsModal
          data={modalState.data}
          show={modalState.isOpen}
          onClose={modalState.close}
        />
      )}
    </>
  );
};

export default GovernanceProxiesTab;
