import React from 'react';

import CloseButton from '../../../../../../components/CloseButton/CloseButton';

import { CandidateIdBadge } from '../../../CandidateIdBadge/CandidateIdBadge';

import { CandidateProps } from '../../../../../../types/governance';

import classes from './CandidateBoardItems.module.scss';

type Props = {
  hideCloseButton?: boolean;
  selectedCandidates?: CandidateProps[];
  onCandidateSelectChange?: (id: string) => void;
};

export const CandidateBoardItems: React.FC<Props> = ({
  hideCloseButton,
  selectedCandidates,
  onCandidateSelectChange,
}) => (
  <div className={classes.container}>
    {selectedCandidates.map(({ image, name, id }) => (
      <div className={classes.candidateItem} key={id}>
        <img src={image} alt="Candidate" className={classes.candidateImage} />
        <div className={classes.nameContainer}>
          <h4 className={classes.name}>{name}</h4>
          <CandidateIdBadge id={id} className={classes.candidateBadge} />
        </div>
        {!hideCloseButton && (
          <CloseButton
            handleClick={() => onCandidateSelectChange(id)}
            className={classes.closeButton}
          />
        )}
      </div>
    ))}
  </div>
);
