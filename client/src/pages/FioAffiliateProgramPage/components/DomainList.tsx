import React from 'react';

import { ListItemsComponent } from '../../../components/ManagePageContainer/components/ListItemsComponent';
import { DesktopView } from './ItemsScreenView';

import { FioDomainSelectable } from '../types';

import classes from '../styles/DomainList.module.scss';

type Props = {
  domains: FioDomainSelectable[];
  loading: boolean;
  isDesktop: boolean;
  handleRenewDomain: (domain: string) => void;
  handleVisibility: (domain: string) => void;
  handleSelect: (domain: string) => void;
};

export const DomainList: React.FC<Props> = props => {
  const {
    domains,
    // loading,
    isDesktop,
    handleRenewDomain,
    handleVisibility,
    handleSelect,
  } = props;

  const listItemsDefaultProps = {
    fioNameList: domains,
    isDesktop,
    isDomainWatchlist: true,
    pageName: 'domain',
  };

  return (
    <div className={classes.container}>
      <ListItemsComponent
        listItems={
          isDesktop ? (
            <DesktopView
              {...listItemsDefaultProps}
              onRenewDomain={handleRenewDomain}
              onVisibilityChange={handleVisibility}
              onSelect={handleSelect}
            />
          ) : (
            <div />
          )
        }
      />
    </div>
  );
};
