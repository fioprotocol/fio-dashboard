import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import FioAddress from './FioAddress';

import { PLURAL_NAME } from '../constants';

import { DefaultProps } from '../types';

import classes from './UIView.module.scss';

const MobileView: React.FC<DefaultProps> = props => {
  const {
    fioNameList,
    pageName,
    showInfoBadge,
    toggleShowInfoBadge,
    onItemModalOpen,
    showFioAddressName,
  } = props;

  return (
    <div className={classes.container}>
      <h5 className={classes.tableHeader}>{PLURAL_NAME[pageName]}</h5>
      {fioNameList &&
        fioNameList.map(fioNameItem => {
          const { name = '' } = fioNameItem;
          return (
            <div
              className={classes.dataItemContainer}
              key={name}
              onClick={() => onItemModalOpen && onItemModalOpen(fioNameItem)}
            >
              {showFioAddressName ? (
                <FioAddress
                  name={name}
                  showInfoBadge={showInfoBadge}
                  toggleShowInfoBadge={toggleShowInfoBadge}
                />
              ) : (
                name
              )}
              <FontAwesomeIcon
                icon="chevron-right"
                className={classes.openIcon}
              />
            </div>
          );
        })}
    </div>
  );
};

export default MobileView;
