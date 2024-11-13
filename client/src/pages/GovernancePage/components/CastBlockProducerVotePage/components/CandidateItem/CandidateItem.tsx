import React from 'react';

import CloseButton from '../../../../../../components/CloseButton/CloseButton';

import { BlockProducersItemProps } from '../../../../../../types/governance';

import classes from './CandidateItem.module.scss';

type Props = {
  hideCloseButton?: boolean;
  selectedBlockProducers: BlockProducersItemProps[];
  onBlockProducerSelectChange?: (id: string) => void;
};

export const CandidateItem: React.FC<Props> = props => {
  const {
    hideCloseButton,
    selectedBlockProducers,
    onBlockProducerSelectChange,
  } = props;
  return (
    <div className={classes.container}>
      {selectedBlockProducers.map(
        ({ logo, defaultDarkLogo, fioAddress, id }) => (
          <div className={classes.candidateItem} key={id}>
            <img
              src={logo || defaultDarkLogo}
              alt="Block Producer"
              className={classes.candidateImage}
            />
            <h4 className={classes.name}>{fioAddress}</h4>
            {!hideCloseButton && (
              <CloseButton
                handleClick={() => onBlockProducerSelectChange(id)}
                className={classes.closeButton}
              />
            )}
          </div>
        ),
      )}
    </div>
  );
};
