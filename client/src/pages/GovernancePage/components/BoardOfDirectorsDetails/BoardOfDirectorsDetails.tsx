import React from 'react';

import { MemberBadge } from '../MemberBadge/MemberBadge';
import { CandidateIdBadge } from '../CandidateIdBadge/CandidateIdBadge';
import Amount from '../../../../components/common/Amount';

import { CandidateProps } from '../../../../types/governance';

import classes from './BoardOfDirectorsDetails.module.scss';

type Props = {
  activeCandidate: CandidateProps;
};

export const BoardOfDirectorsDetails: React.FC<Props> = props => {
  const { activeCandidate } = props;

  if (!activeCandidate) return null;

  const {
    country,
    id,
    image,
    lastVoteCount,
    links,
    name,
    status,
    text,
    url,
  } = activeCandidate;

  return (
    <div className={classes.container}>
      <h4 className={classes.title}>Candidate</h4>
      <div className={classes.dataContainer}>
        <div className={classes.mediaContainer}>
          <img src={image} alt="candidate" className={classes.image} />
          <div className={classes.statusContainer}>
            <MemberBadge status={status} />
            <CandidateIdBadge id={id} />
          </div>
        </div>
        <div className={classes.textContainer}>
          <h4 className={classes.name}>{name}</h4>
          <p className={classes.count}>
            Last Vote Count: <Amount>{lastVoteCount}</Amount>
          </p>
          {url ? (
            <div className={classes.url}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                {url}
              </a>
            </div>
          ) : null}
          <h5 className={classes.country}>Country: {country}</h5>
          <p className={classes.text}>{text}</p>
          <div className={classes.linksContainer}>
            {links?.map(({ url, logo }) => (
              <a href={url} target="_blank" rel="noopener noreferrer" key={url}>
                <img alt="logo" src={logo} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
