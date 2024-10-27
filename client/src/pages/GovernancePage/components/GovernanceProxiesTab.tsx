import { FC, useState } from 'react';

import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

import classes from '../styles/GovernanceProxiesTab.module.scss';
import ActionButton from '../../SettingsPage/components/ActionButton';
import { ProxyDetailsModal } from './ProxyDetailsModal';

const MOCK_PROXIES = [
  {
    name: 't01zeqsjq5cb',
    handle: 'finance@edge',
  },
  {
    name: 't02zeqsjq5cb',
    handle: 'finance@edge',
  },
  {
    name: 't03zeqsjq5cb',
    handle: 'finance@edge',
  },
  {
    name: 't04zeqsjq5cb',
    handle: 'finance@edge',
  },
  {
    name: 't05zeqsjq5cb',
    handle: 'finance@edge',
  },
  {
    name: 't06zeqsjq5cb',
    handle: 'finance@edge',
  },
  {
    name: 't07zeqsjq5cb',
    handle: 'finance@edge',
  },
];

const MOCK_PRODUCERS = [
  'genpoolproxy1',
  'genpoolproxy2',
  'genpoolproxy3',
  'genpoolproxy4',
  'genpoolproxy5',
  'genpoolproxy6',
  'genpoolproxy7',
  'genpoolproxy8',
  'genpoolproxy9',
  'genpoolproxy10',
  'genpoolproxy11',
  'genpoolproxy12',
  'genpoolproxy13',
  'genpoolproxy14',
  'genpoolproxy15',
  'genpoolproxy16',
  'genpoolproxy17',
  'genpoolproxy18',
  'genpoolproxy19',
  'genpoolproxy20',
];

export const GovernanceProxiesTab: FC = () => {
  const [defaultSelectedProxy] = MOCK_PROXIES;

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProxy, setSelectedProxy] = useState<string>(
    defaultSelectedProxy?.name,
  );

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
          <a href="https://" className={classes.infoLink}>
            Would you rather vote directly?
          </a>
        </div>
        <ActionButton
          className={classes.infoActionButton}
          title="Proxy Now"
          isIndigo
          onClick={() => {}}
        />
      </div>
      <div className={classes.proxiesList}>
        {MOCK_PROXIES.map(it => (
          <div key={it.name} className={classes.proxyBlock}>
            <div className={classes.proxyBlockContent}>
              <div
                className={classes.proxyBlockRadio}
                onClick={() =>
                  it.name !== selectedProxy
                    ? setSelectedProxy(it.name)
                    : setSelectedProxy(undefined)
                }
              >
                {selectedProxy === it.name ? (
                  <RadioButtonCheckedIcon />
                ) : (
                  <RadioButtonUncheckedIcon />
                )}
              </div>
              <p className={classes.proxyBlockData}>
                <span>{it.name}</span>
                <span>FIO Handle: {it.handle}</span>
              </p>
            </div>
            <ActionButton
              className={classes.proxyBlockActionButton}
              title="View"
              isIndigo
              onClick={() => setIsDetailsModalOpen(true)}
            />
          </div>
        ))}
      </div>
      <ActionButton
        className={classes.proxyNowActionButton}
        title="Proxy Now"
        isIndigo
        disabled={!selectedProxy}
        onClick={() => {}}
      />
      {selectedProxy && (
        <ProxyDetailsModal
          data={{
            name: 't01zeqsjq5cb',
            handle: 'finance@edge',
            voteWeight: 912739.0,
            lastVoteWeight: 812739.0,
            producers: MOCK_PRODUCERS,
          }}
          show={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </>
  );
};

export default GovernanceProxiesTab;
