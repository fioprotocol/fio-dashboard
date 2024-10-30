import React from 'react';

import { FioNameItemProps, FioNameType } from '../../../../types';

import classes from './UIView.module.scss';

type MobileViewProps = {
  fioNameList: FioNameItemProps[];
  hideTableHeader?: boolean;
  isAddress?: boolean;
  pageName: FioNameType;
  // onItemModalOpen: ModalOpenActionType;
};

export const MobileView: React.FC<MobileViewProps> = props => {
  return <div className={classes.container} />;
};
