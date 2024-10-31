import { FC, useState } from 'react';
import classnames from 'classnames';

import TelegramIcon from '../../../assets/images/social-network-block-producers/telegram.svg';
import TwitterIcon from '../../../assets/images/social-network-block-producers/twitter.svg';
import WebIcon from '../../../assets/images/social-network-block-producers/web.svg';

import classes from '../styles/WalletVotesDetailsModal.module.scss';
import Modal from '../../../components/Modal/Modal';
import CustomDropdown from '../../../components/CustomDropdown';
import { TabsSelector } from './TabsSelector';
import { TabItemProps } from '../../../components/Tabs/types';

import noImageIconSrc from '../../../assets/images/no-photo.svg';

import { CANDIDATE_STATUS } from '../../../constants/governance';
import { CandidateProps } from '../../../types/governance';
import { useGetCandidates } from '../../../hooks/governance';
import Loader from '../../../components/Loader/Loader';
import { BADGE_TYPES } from '../../../components/Badge/Badge';
import InfoBadge from '../../../components/InfoBadge/InfoBadge';

export type WalletVotesDetailsProps = {
  show?: boolean;
  onClose?: () => void;
};

const WALLETS_MOCK = [
  {
    name: 'Wallet Numero Uno 1',
    proxied: false,
    votingPower: 19384759,
  },
  {
    name: 'Wallet Numero Uno 2',
    proxied: false,
    votingPower: 0,
  },
  {
    name: 'Wallet Numero Uno 3',
    proxied: true,
    votingPower: 19384759,
  },
  {
    name: 'Wallet Numero Uno 4',
    proxied: true,
    votingPower: 0,
  },
];

const BLOCK_PRODUCERS = [
  {
    logo: 'https://www.eosphere.io/eospherelogosquare.svg',
    flag: 'https://bpmonitor.fio.net/flags/usa.svg',
    name: 'EIOSphere 1',
    handle: 'bp@blockpane',
    level: 'A-',
    top: 21,
  },
  {
    logo: 'https://www.eosphere.io/eospherelogosquare.svg',
    flag: 'https://bpmonitor.fio.net/flags/usa.svg',
    name: 'EIOSphere 2',
    handle: 'bp@blockpane',
    level: 'A-',
    top: 21,
  },
  {
    logo: 'https://www.eosphere.io/eospherelogosquare.svg',
    flag: 'https://bpmonitor.fio.net/flags/usa.svg',
    name: 'EIOSphere 3',
    handle: 'bp@blockpane',
    level: 'A-',
    top: 21,
  },
  {
    logo: 'https://www.eosphere.io/eospherelogosquare.svg',
    flag: 'https://bpmonitor.fio.net/flags/usa.svg',
    name: 'EIOSphere 4',
    handle: 'bp@blockpane',
    level: 'A-',
    top: 21,
  },
  {
    logo: 'https://www.eosphere.io/eospherelogosquare.svg',
    flag: 'https://bpmonitor.fio.net/flags/usa.svg',
    name: 'EIOSphere 5',
    handle: 'bp@blockpane',
    level: 'A-',
    top: 21,
  },
  {
    logo: 'https://www.eosphere.io/eospherelogosquare.svg',
    flag: 'https://bpmonitor.fio.net/flags/usa.svg',
    name: 'EIOSphere 6',
    handle: 'bp@blockpane',
    level: 'A-',
    top: 21,
  },
  {
    logo: 'https://www.eosphere.io/eospherelogosquare.svg',
    flag: 'https://bpmonitor.fio.net/flags/usa.svg',
    name: 'EIOSphere 7',
    handle: 'bp@blockpane',
    level: 'A-',
    top: 21,
  },
];

type MockWallet = typeof WALLETS_MOCK[number];

type MockBlockProducer = typeof BLOCK_PRODUCERS[number];

export const WalletVotesDetailsModal: FC<WalletVotesDetailsProps> = ({
  show,
  onClose,
}) => {
  const [activeWallet, setActiveWallet] = useState(WALLETS_MOCK[0]);

  const TABS: TabItemProps[] = [
    {
      eventKey: 'board',
      title: (
        <>
          <span className={classes.tabsLargeTitle}>FIO Foundation&nbsp;</span>
          Board of Directors
        </>
      ),
      renderTab: () => <BoardTab activeWallet={activeWallet} />,
    },
    {
      eventKey: 'producers',
      title: 'Block Producers',
      renderTab: () => <ProducersTab activeWallet={activeWallet} />,
    },
  ];

  return (
    <Modal
      title="My Current Votes"
      headerClass={classes.header}
      show={show}
      onClose={onClose}
      closeButton={true}
      isSimple={true}
      hasDefaultCloseColor={true}
      isWide={true}
    >
      <div className={classes.container}>
        <CustomDropdown
          dropdownClassNames={classes.dropdownContainer}
          value={activeWallet.name}
          options={WALLETS_MOCK.map(({ name }) => ({
            id: name,
            name,
          }))}
          onChange={key =>
            setActiveWallet(WALLETS_MOCK.find(it => it.name === key))
          }
          withoutMarginBottom
          hasAutoWidth
          isWhite
          isSimple
          placeholder="Voting Overview"
        />
        <TabsSelector
          defaultActiveKey="board"
          className={classes.tabsContainer}
          list={TABS}
        />
      </div>
    </Modal>
  );
};

type TabProps = {
  activeWallet: MockWallet;
};

const BoardTab: FC<TabProps> = ({ activeWallet }) => {
  const { loading, candidatesList } = useGetCandidates();

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {!activeWallet.proxied && (
        <InfoBadge
          className={classes.infoBadge}
          type={BADGE_TYPES.INFO}
          show={true}
          title="Your Last Vote Count Power"
          message="If you have vote recently, please note that your vote will show up after the next count date."
        />
      )}
      {activeWallet.proxied ? (
        <ProxyVoteDetails
          power={activeWallet.votingPower}
          name="t21zeqsjq5cb"
          handle="finance@edge"
        />
      ) : (
        <MyVoteDetails
          powerLabelSuffix="Board"
          power={activeWallet.votingPower}
          lastVote={new Date()}
          lastUpdated={new Date()}
        />
      )}
      {activeWallet.votingPower > 0 && (
        <div className={classes.tabsScrollContainer}>
          {candidatesList.map(candidateItem => (
            <DirectorBlock key={candidateItem.id} candidate={candidateItem} />
          ))}
        </div>
      )}
    </>
  );
};

const ProducersTab: FC<TabProps> = ({ activeWallet }) => {
  return (
    <>
      {activeWallet.proxied ? (
        <ProxyVoteDetails
          power={activeWallet.votingPower}
          name="t21zeqsjq5cb"
          handle="finance@edge"
        />
      ) : (
        <MyVoteDetails power={activeWallet.votingPower} />
      )}
      {BLOCK_PRODUCERS.length > 0 && (
        <div className={classes.tabsScrollContainer}>
          {BLOCK_PRODUCERS.map(it => (
            <BlockProducerBlock key={it.name} producer={it} />
          ))}
        </div>
      )}
    </>
  );
};

type MyVoteDetailsProps = {
  powerLabelSuffix?: string;
  power: number;
  lastVote?: Date;
  lastUpdated?: Date;
};

const MyVoteDetails: FC<MyVoteDetailsProps> = ({
  powerLabelSuffix,
  power,
  lastVote,
  lastUpdated,
}) => {
  const formatDate = (date: Date) =>
    date
      .toLocaleDateString('en', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
      .replace('at', '@');

  return (
    <>
      <div className={classes.detailsContainer}>
        {lastVote && (
          <p className={classes.detailsItem}>
            <span className={classes.detailsLabel}>Last Board Vote:</span>
            <span className={classes.detailsValue}>{formatDate(lastVote)}</span>
          </p>
        )}
        <p className={classes.detailsItem}>
          <span className={classes.detailsLabel}>
            Current&nbsp;{powerLabelSuffix ? <>Board&nbsp;</> : ''}Voting Power:
          </span>
          <span className={classes.detailsValue}>
            {power.toLocaleString('en', {
              minimumFractionDigits: 4,
            })}
            &nbsp;FIO
          </span>
        </p>
        {lastUpdated && (
          <p className={classes.detailsItem}>
            <span className={classes.detailsLabel}>
              Board Voting Power Last Updated:
            </span>
            <span className={classes.detailsValue}>
              {formatDate(lastUpdated)}
            </span>
          </p>
        )}
      </div>
      {power === 0 && (
        <InfoBadge
          className={classes.infoBadge}
          type={BADGE_TYPES.ERROR}
          show={true}
          title="Not Voting Tokens "
          message={
            <>
              You are not voting the tokens in this wallet.&nbsp;
              <a href="https://" className={classes.infoBadgeLink}>
                Go Vote Your Tokens
              </a>
            </>
          }
        />
      )}
    </>
  );
};

type ProxyVoteDetailsProps = {
  power: number;
  name: string;
  handle: string;
};

const ProxyVoteDetails: FC<ProxyVoteDetailsProps> = ({ power }) => {
  return (
    <>
      <InfoBadge
        className={classes.infoBadge}
        type={BADGE_TYPES.INFO}
        show={true}
        title="Proxied"
        message={
          <>
            Your tokens for this wallet are proxied. They count towards your
            proxy's vote, not your own. To stop proxying,&nbsp;
            <a href="https://" className={classes.infoBadgeLink}>
              vote for block producers
            </a>
            .
          </>
        }
      />
      <h5 className={classes.proxyDetailsTitle}>Your Proxy</h5>
      <div className={classes.detailsContainer}>
        <p className={classes.detailsItem}>
          <span className={classes.detailsLabel}>Name:</span>
          <span className={classes.detailsValue}>t21zeqsjq5cb</span>
        </p>
        <p className={classes.detailsItem}>
          <span className={classes.detailsLabel}>FIO Handle:</span>
          <span className={classes.detailsValue}>finance@edge</span>
        </p>
      </div>
      <h5 className={classes.proxyDetailsSubTitle}>Proxy Vote Details</h5>
      {power === 0 && (
        <InfoBadge
          className={classes.infoBadge}
          type={BADGE_TYPES.ERROR}
          show={true}
          title="Not Voting Tokens"
          message="This proxy is voting for 0 FIO Foundation Board of Directors"
        />
      )}
    </>
  );
};

type DirectorBlockProps = {
  candidate: CandidateProps;
};

const DirectorBlock: FC<DirectorBlockProps> = ({ candidate }) => {
  const { id, name, image, status, lastVoteCount } = candidate;

  return (
    <div className={classes.directorContainer}>
      <div className={classes.contentContainer}>
        <div className={classes.dataContainer}>
          <img
            src={image || noImageIconSrc}
            alt={`candidate ${id}`}
            className={classnames(classes.img, !image && classes.withoutPhoto)}
          />
          <div className={classes.nameContainer}>
            <p className={classes.name}>{name}</p>
            <p className={classes.lastVotedCount}>
              Last Vote Count: <span>{lastVoteCount.toLocaleString('en')}</span>
            </p>
          </div>
        </div>
        <div className={classes.itemActionContainer}>
          <div
            className={classnames(
              classes.status,
              status === CANDIDATE_STATUS.CANDIDATE && classes.candidate,
              status === CANDIDATE_STATUS.INACTIVE && classes.inactive,
            )}
          >
            {status}
          </div>
          <div className={classes.id}>Candidate: {id}</div>
        </div>
      </div>
    </div>
  );
};

type BlockProducerBlockProps = {
  producer: MockBlockProducer;
};

const BlockProducerBlock: FC<BlockProducerBlockProps> = ({ producer }) => {
  const { logo, name, handle, flag, level, top } = producer;

  return (
    <div className={classes.producerContainer}>
      <div className={classes.mainContent}>
        <img className={classes.logo} src={logo} alt="logo" />
        <div className={classes.content}>
          <span className={classes.name}>{name}</span>
          <span className={classes.handle}>{handle}</span>
        </div>
      </div>
      <div className={classes.infoContent}>
        <img className={classes.flag} src={flag} alt="flag" />
        <div className={classes.socialLinks}>
          <img className={classes.social} src={TelegramIcon} alt="telegram" />
          <img className={classes.social} src={TwitterIcon} alt="twitter" />
          <img className={classes.social} src={WebIcon} alt="web" />
        </div>
        <div className={classes.tags}>
          <span className={classnames(classes.tag, classes.green)}>
            {level}
          </span>
          <span className={classnames(classes.tag, classes.black)}>{top}</span>
        </div>
      </div>
    </div>
  );
};
