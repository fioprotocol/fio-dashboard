import { FC } from 'react';
import { Link } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import ErrorIcon from '@mui/icons-material/Error';

import Loader from '../../../../components/Loader/Loader';
import { CheckBox } from '../../../../components/common/CheckBox/CheckBox';
import NotificationBadge from '../../../../components/NotificationBadge';
import { BADGE_TYPES } from '../../../../components/Badge/Badge';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';

import { GradeBadge } from '../GradeBadge/GradeBadge';
import { MyCurrentVotes } from '../MyCurrentVotes';

import { ROUTES } from '../../../../constants/routes';

import { useContext } from './BlockProducersTabContext';

import { GovernancePageContextProps } from '../../types';

import classes from './BlockProducersTab.module.scss';

export const BlockProducersTab: FC<GovernancePageContextProps> = props => {
  const {
    bpLoading,
    listOfBlockProducers,
    onBlockProducerSelectChange,
  } = props;

  const { disabledCastBPVote, nextDate, handleCastVote } = useContext({
    listOfBlockProducers,
  });

  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <h5 className={classes.title}>Next Election Date</h5>
        <h5 className={classes.date}>{nextDate}</h5>
      </div>
      <div className={classes.tileContainer}>
        <MyCurrentVotes />
      </div>
      <div className={classes.textContainer}>
        <div className={classes.textHeaderContainer}>
          <h4 className={classes.textTitle}>Current Block Producers</h4>
          <p className={classes.text}>
            Block Producers (BPs) are the backbone of the FIO Chain, responsible
            for running the infrastructure necessary to maintain the network.
          </p>
          <Link to={ROUTES.GOVERNANCE_PROXIES} className={classes.link}>
            Would you rather proxy your vote?
          </Link>
          <OverlayTrigger
            trigger={['hover', 'click']}
            placement="top-start"
            overlay={
              <Tooltip id="status" className={classes.infoTooltip}>
                The FIO Foundation is responsible for scoring block producers.
                Block producers are evaluated based on several important tasks.
                These include keeping their nodes up and running, voting on fees
                and bundles, offering helpful tools to the community, signing
                transactions, taking part in the testnet, maintaining an active
                FIO Handle, and consistently producing blocks without missing
                any.
              </Tooltip>
            }
          >
            <div className={classes.link}>Block producer scoring</div>
          </OverlayTrigger>
        </div>
        <SubmitButton
          text="Cast Vote"
          onClick={handleCastVote}
          disabled={disabledCastBPVote}
          className={classes.actionButton}
        />
      </div>
      <div className={classes.bpListContainer}>
        {bpLoading ? (
          <Loader />
        ) : (
          listOfBlockProducers.map(
            ({
              fioAddress,
              flagIconUrl,
              grade,
              id,
              isTop21,
              isValidFioHandle,
              links,
              logo,
              name,
              owner,
              totalVotes,
            }) => (
              <div className={classes.bpItemContainer}>
                <div className={classes.bpItem} key={id}>
                  <CheckBox
                    disabled={!isValidFioHandle}
                    onChange={() => onBlockProducerSelectChange(id)}
                    className={classes.checkbox}
                  />
                  <div className={classes.container}>
                    <div className={classes.headerContainer}>
                      <img
                        src={logo}
                        alt="Block Producer"
                        className={classes.logo}
                      />
                      <div className={classes.nameContainer}>
                        <h4 className={classes.name}>{name}</h4>
                        <p className={classes.details}>
                          {owner}{' '}
                          <span
                            className={!isValidFioHandle && classes.notValid}
                          >
                            {fioAddress}
                          </span>
                        </p>
                        <p className={classes.totalVotes}>
                          Total Votes:{' '}
                          <span className={classes.count}>{totalVotes}</span>
                        </p>
                      </div>
                    </div>
                    <div className={classes.dataContainer}>
                      <div className={classes.linksContainer}>
                        {links.map(({ logo, url }) => (
                          <div className={classes.linkItem} key={logo}>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img alt="logo" src={logo} />
                            </a>
                          </div>
                        ))}
                      </div>
                      {flagIconUrl ? (
                        <img
                          src={flagIconUrl}
                          alt="flag"
                          className={classes.flag}
                        />
                      ) : null}
                      <div className={classes.gradeContainer}>
                        <GradeBadge grade={grade} />
                        {isTop21 ? (
                          <div className={classes.topScore}>TOP 21</div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
                {!isValidFioHandle ? (
                  <NotificationBadge
                    type={BADGE_TYPES.ERROR}
                    show
                    message="Voting for this block producer is not possible."
                    hasNewDesign
                    marginTopZero
                    mainIcon={<ErrorIcon />}
                    className={classes.notificationBadge}
                  />
                ) : null}
              </div>
            ),
          )
        )}
      </div>
      <SubmitButton
        text="Cast Vote"
        onClick={handleCastVote}
        disabled={disabledCastBPVote}
        className={classes.actionButtonBottom}
        withTopMargin
      />
    </div>
  );
};
