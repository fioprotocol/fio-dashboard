import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import classnames from 'classnames';

import { DateComponent } from '../../../../components/ManagePageContainer/components/DateComponent';
import { CheckedIcon, DomainActionButtons } from './ActionButtons';

import DomainStatusBadge from '../../../../components/Badges/DomainStatusBadge/DomainStatusBadge';

import {
  PAGE_NAME,
  TABLE_HEADERS_LIST,
} from '../../../../components/ManagePageContainer/constants';
import { DOMAIN_STATUS } from '../../../../constants/common';

import {
  isDomainExpired,
  isDomainWillExpireIn30Days,
} from '../../../../util/fio';

import InfoCopy from '../../../../assets/images/info-copy.svg';

import { FioDomainSelectable } from '../../types';

import classes from './UIView.module.scss';

type ItemComponentProps = {
  fioNameItem: FioDomainSelectable;
  isDesktop?: boolean;
  onVisibilityChange: (name: string) => void;
  onSelect: (name: string) => void;
};

type DesktopViewProps = {
  domains: FioDomainSelectable[];
  isDesktop?: boolean;
  isDomainWatchlist?: boolean;
  onVisibilityChange?: (name: string) => void;
  onRenewDomain?: (name: string) => void;
  onSelect: (name: string) => void;
};

const DomainItemComponent: React.FC<ItemComponentProps & {
  onRenewDomain: (name: string) => void;
}> = props => {
  const {
    fioNameItem,
    isDesktop,
    onVisibilityChange,
    onRenewDomain,
    onSelect,
  } = props;
  const { selected, name, isPublic, expiration } = fioNameItem;

  const isExpired = isDomainExpired(name, expiration);
  const isExpiredIn30Days = isDomainWillExpireIn30Days(name, expiration);
  const onClick = () => isPublic && onSelect(name);

  return (
    <React.Fragment key={name}>
      <div className={classnames(classes.tableCol, classes.firstCol)}>
        <div
          className={classnames(
            classes.nameContainer,
            classes.checkContainer,
            !isPublic && classes.disabled,
          )}
        >
          <CheckedIcon
            isChecked={selected}
            onClick={onClick}
            disabled={!isPublic}
          />
          <p className={classes.name} onClick={onClick}>
            {name}
          </p>
        </div>
      </div>
      <div className={classes.tableCol}>
        <DomainStatusBadge
          status={isPublic ? DOMAIN_STATUS.PUBLIC : DOMAIN_STATUS.PRIVATE}
        />
      </div>
      <div className={classes.tableCol}>
        <DateComponent
          expiration={expiration}
          isExpired={isExpired}
          isExpiredIn30Days={isExpiredIn30Days}
        />
      </div>
      <div className={classnames(classes.tableCol, classes.lastCol)}>
        <DomainActionButtons
          fioDomain={fioNameItem}
          isDesktop={isDesktop}
          isExpired={isExpired}
          onRenewDomain={onRenewDomain}
          onVisibilityChange={onVisibilityChange}
        />
      </div>
    </React.Fragment>
  );
};

export const DesktopView: React.FC<DesktopViewProps> = props => {
  const {
    domains,
    isDesktop,
    onVisibilityChange,
    onRenewDomain,
    onSelect,
  } = props;

  return (
    <div className={classnames(classes.container, classes.isDomain)}>
      {TABLE_HEADERS_LIST[PAGE_NAME.DOMAIN].map((headerItem, index) => (
        <div
          className={classnames(
            classes.tableHeader,
            index === 0 && classes.firstHeaderCol,
          )}
          key={headerItem}
        >
          {headerItem}
          {headerItem === 'Status' && (
            <>
              {' '}
              <OverlayTrigger
                trigger={['hover', 'click']}
                placement="top-start"
                overlay={
                  <Tooltip id="status" className={classes.infoTooltip}>
                    FIO Domains can be public, allowing anyone to register FIO
                    Handles on them, or private, which makes the user the only
                    registrar.
                  </Tooltip>
                }
              >
                <img src={InfoCopy} alt="info" className={classes.infoCopy} />
              </OverlayTrigger>
            </>
          )}
        </div>
      ))}
      {domains &&
        domains.map(domain => (
          <DomainItemComponent
            fioNameItem={domain}
            isDesktop={isDesktop}
            key={domain.name}
            onVisibilityChange={onVisibilityChange}
            onRenewDomain={onRenewDomain}
            onSelect={onSelect}
          />
        ))}
    </div>
  );
};
