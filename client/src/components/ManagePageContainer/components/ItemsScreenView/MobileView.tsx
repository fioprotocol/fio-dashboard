import React from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import WarningIcon from '@mui/icons-material/Warning';

import { FioAddress } from '../FioAddress';

import { PLURAL_NAME } from '../../constants';
import { LOW_BUNDLES_THRESHOLD } from '../../../../constants/fio';

import {
  isDomainExpired,
  isDomainWillExpireIn30Days,
} from '../../../../util/fio';

import { ModalOpenActionType } from '../../types';
import { FioNameItemProps, FioNameType } from '../../../../types';

import classes from './UIView.module.scss';

type MobileViewProps = {
  fioNameList: FioNameItemProps[];
  hideTableHeader?: boolean;
  isAddress?: boolean;
  pageName: FioNameType;
  onItemModalOpen: ModalOpenActionType;
};

export const MobileView: React.FC<MobileViewProps> = props => {
  const {
    fioNameList,
    hideTableHeader,
    isAddress,
    pageName,
    onItemModalOpen,
  } = props;

  return (
    <div className={classes.container}>
      <h5 className={classes.tableHeader}>
        {!hideTableHeader && PLURAL_NAME[pageName]}
      </h5>
      {fioNameList &&
        fioNameList.map(fioNameItem => {
          const { name = '', expiration, remaining } = fioNameItem;

          let isExpired = null,
            isExpiredIn30Days = null,
            hasLowBundles = null;

          if (expiration) {
            isExpired = isDomainExpired(name, expiration);
            isExpiredIn30Days = isDomainWillExpireIn30Days(name, expiration);
          }

          if (remaining >= 0) {
            hasLowBundles = remaining < LOW_BUNDLES_THRESHOLD;
          }

          return (
            <div
              className={classes.dataItemContainer}
              key={name}
              onClick={() => onItemModalOpen && onItemModalOpen(fioNameItem)}
            >
              {isAddress ? <FioAddress name={name} /> : name}
              {(isExpired || isExpiredIn30Days || hasLowBundles) && (
                <WarningIcon className={classes.warnIcon} />
              )}
              <ChevronRightIcon className={classes.openIcon} />
            </div>
          );
        })}
    </div>
  );
};
