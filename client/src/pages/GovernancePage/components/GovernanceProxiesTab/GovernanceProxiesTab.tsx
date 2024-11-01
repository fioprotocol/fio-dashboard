import { FC, useState } from 'react';

import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

import { Link } from 'react-router-dom';

import classes from './GovernanceProxiesTab.module.scss';
import ActionButton from '../../../SettingsPage/components/ActionButton';
import { ProxyDetailsModal } from '../ProxyDetailsModal';
import Loader from '../../../../components/Loader/Loader';
import { DetailedProxy } from '../../../../types';
import { useDetailedProxies } from '../../../../hooks/governance';
import { ROUTES } from '../../../../constants/routes';

export const GovernanceProxiesTab: FC = () => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProxy, setSelectedProxy] = useState<DetailedProxy>();
  const [detailedProxy, setDetailedProxy] = useState<DetailedProxy>();

  const { loading, proxyList } = useDetailedProxies();

  return (
    <>
      <div className={classes.myVotes}>
        <h4 className={classes.myVotesTitle}>My Current Votes</h4>
        <ActionButton
          className={classes.myVotesActionButton}
          title="View"
          isIndigo
          onClick={() => {}}
        />
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
          disabled={loading}
          onClick={() => {}}
        />
      </div>
      <div className={classes.proxiesList}>
        {loading ? (
          <Loader />
        ) : proxyList.length === 0 ? null : (
          proxyList.map(proxy => (
            <div key={proxy.id} className={classes.proxyBlock}>
              <div className={classes.proxyBlockContent}>
                <div
                  className={classes.proxyBlockRadio}
                  onClick={() =>
                    proxy !== selectedProxy
                      ? setSelectedProxy(proxy)
                      : setSelectedProxy(undefined)
                  }
                >
                  {selectedProxy === proxy ? (
                    <RadioButtonCheckedIcon />
                  ) : (
                    <RadioButtonUncheckedIcon />
                  )}
                </div>
                <p className={classes.proxyBlockData}>
                  <span>{proxy.owner}</span>
                  <span>FIO Handle: {proxy.fioAddress}</span>
                </p>
              </div>
              <ActionButton
                className={classes.proxyBlockActionButton}
                title="View"
                isIndigo
                onClick={() => {
                  setDetailedProxy(proxy);
                  setIsDetailsModalOpen(true);
                }}
              />
            </div>
          ))
        )}
      </div>
      <ActionButton
        className={classes.proxyNowActionButton}
        title="Proxy Now"
        isIndigo
        disabled={!selectedProxy}
        onClick={() => {}}
      />
      {detailedProxy && (
        <ProxyDetailsModal
          data={detailedProxy}
          show={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </>
  );
};

export default GovernanceProxiesTab;
