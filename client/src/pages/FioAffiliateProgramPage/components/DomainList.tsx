import React from 'react';

import { ListItemsComponent } from '../../../components/ManagePageContainer/components/ListItemsComponent';
import { DesktopView, MobileView } from './ItemsScreenView';

import { FioDomainSelectable } from '../types';

import classes from '../styles/DomainList.module.scss';

type Props = {
  domains: FioDomainSelectable[];
  loading: boolean;
  isDesktop: boolean;
  onItemModalOpen: (domain: FioDomainSelectable) => void;
  handleRenewDomain: (domain: string) => void;
  handleVisibility: (domain: string) => void;
  handleSelect: (domain: string) => void;
};

export const DomainList: React.FC<Props> = props => {
  const {
    domains,
    // loading,
    isDesktop,
    onItemModalOpen,
    handleRenewDomain,
    handleVisibility,
    handleSelect,
  } = props;

  const listItemsDefaultProps = {
    domains,
    isDesktop,
    isDomainWatchlist: true,
    pageName: 'domain',
  };

  return (
    <>
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
              <MobileView
                {...listItemsDefaultProps}
                onItemModalOpen={onItemModalOpen}
                onRenewDomain={handleRenewDomain}
                onVisibilityChange={handleVisibility}
                onSelect={handleSelect}
              />
            )
          }
        />
      </div>
    </>
  );
};
