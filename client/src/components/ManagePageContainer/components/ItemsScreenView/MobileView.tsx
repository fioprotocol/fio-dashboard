import React from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { FioAddress } from '../FioAddress';

import { PLURAL_NAME } from '../../constants';

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
          const { name = '' } = fioNameItem;
          return (
            <div
              className={classes.dataItemContainer}
              key={name}
              onClick={() => onItemModalOpen && onItemModalOpen(fioNameItem)}
            >
              {isAddress ? <FioAddress name={name} /> : name}
              <ChevronRightIcon className={classes.openIcon} />
            </div>
          );
        })}
    </div>
  );
};
