import React from 'react';
import classnames from 'classnames';

import WarningIcon from '@mui/icons-material/Warning';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { CheckedIcon } from './ActionButtons';

import { FioDomainSelectable } from '../../types';

import {
  isDomainExpired,
  isDomainWillExpireIn30Days,
} from '../../../../util/fio';

import classes from './UIView.module.scss';

type MobileViewProps = {
  domains: FioDomainSelectable[];
  onItemModalOpen?: (domain: FioDomainSelectable) => void;
  onVisibilityChange?: (name: string) => void;
  onRenewDomain?: (name: string) => void;
  onSelect: (name: string) => void;
};

export const MobileView: React.FC<MobileViewProps> = props => {
  const { domains, onItemModalOpen, onSelect } = props;
  return (
    <div className={classes.container}>
      {domains &&
        domains.map(domain => {
          const { selected, name = '', expiration, isPublic } = domain;

          const isExpired = isDomainExpired(name, expiration);
          const isExpiredIn30Days = isDomainWillExpireIn30Days(
            name,
            expiration,
          );
          const onClick = () => isPublic && onSelect(name);
          const openDetails = () => onItemModalOpen && onItemModalOpen(domain);

          return (
            <div className={classes.dataItemContainer} key={name}>
              <div
                className={classnames(
                  classes.nameContainer,
                  classes.checkContainer,
                  !isPublic && classes.disabled,
                )}
                onClick={onClick}
              >
                <CheckedIcon
                  isChecked={selected}
                  onClick={onClick}
                  disabled={!isPublic}
                />
                <p className={classes.name}>{name}</p>
              </div>
              <div className={classes.openIcon} onClick={openDetails}>
                {(isExpired || isExpiredIn30Days || !isPublic) && (
                  <WarningIcon className={classes.warnIcon} />
                )}
                <ChevronRightIcon />
              </div>
            </div>
          );
        })}
    </div>
  );
};
