import { FC } from 'react';
import classnames from 'classnames';

import { Link } from 'react-router-dom';

import FioTokens from '../../../assets/images/vote.svg';

import classes from '../styles/VoteBadge.module.scss';
import { ROUTES } from '../../../constants/routes';

type Props = {
  className?: string;
};

export const VoteBadge: FC<Props> = ({ className }) => {
  return (
    <div className={classnames(classes.actionBadgeContainer, className)}>
      <div className={classes.content}>
        <div className={classes.imageContainer}>
          <img src={FioTokens} width={125} height={125} alt="fio tokens" />
        </div>
        <p className={classes.title}>How to Vote and Why You Should</p>
        <p className={classes.description}>
          Want to know more about the voting process for the FIO Foundation
          Board of directors or Block Producers.
        </p>
        <div className={classes.actionButtons}>
          <Link to={ROUTES.GOVERNANCE_VOTING_HELP} className={classes.link}>
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};
