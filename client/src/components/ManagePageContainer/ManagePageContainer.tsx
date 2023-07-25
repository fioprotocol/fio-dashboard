import React from 'react';

import { Redirect } from 'react-router-dom';

import InfiniteScroll from '../InfiniteScroll/InfiniteScroll';
import { Fio101Component } from '../Fio101Component';
import { WelcomeComponent } from '../WelcomeComponent';
import { ListItemsComponent } from './components/ListItemsComponent';
import LayoutContainer from '../LayoutContainer/LayoutContainer';
import Modal from '../Modal/Modal';
import NotificationBadge from '../NotificationBadge';
import { BADGE_TYPES } from '../Badge/Badge';

import { DesktopView } from './components/ItemsScreenView';
import {
  DomainItemComponent,
  FchItemComponent,
} from './components/ItemCopmonent';
import { MobileView } from './components/ItemsScreenView';
import { FchSettingsItem, DomainSettingsItem } from './components/SettingsItem';

import { ROUTES } from '../../constants/routes';

import { useContext } from './ManagePageContainerContext';

import { ContainerProps } from './types';

import classes from './ManagePageContainer.module.scss';

export const ManagePageContainer: React.FC<ContainerProps> = props => {
  const {
    emptyStateContent,
    pageName,
    title,
    warningContent,
    handleAddBundles,
    handleRenewDomain,
  } = props;

  const {
    fio101ComponentProps,
    fioWallets,
    hasNextPage,
    isAddress,
    isDesktop,
    isEmptyList,
    listItemsDefaultProps,
    loading,
    noProfileLoaded,
    selectedFioNameItem,
    showWarnBadge,
    showItemModal,
    showSettingsModal,
    welcomeComponentProps,
    loadMore,
    onItemModalClose,
    onItemModalOpen,
    onSettingsClose,
    onSettingsOpen,
    toggleShowWarnBadge,
  } = useContext({ pageName });

  if (noProfileLoaded) return <Redirect to={{ pathname: ROUTES.HOME }} />;

  return (
    <div className={classes.container}>
      <LayoutContainer title={title}>
        <div className={classes.dataContainer}>
          <NotificationBadge
            type={BADGE_TYPES.WARNING}
            title={warningContent.title}
            message={warningContent.message}
            show={showWarnBadge}
            withoutMargin
            onClose={() => toggleShowWarnBadge(false)}
          />
          <InfiniteScroll
            loading={loading}
            hasNextPage={hasNextPage}
            onLoadMore={loadMore}
          >
            <ListItemsComponent
              isEmpty={isEmptyList && !loading}
              emptyStateContent={emptyStateContent}
              listItems={
                isDesktop ? (
                  <DesktopView
                    {...listItemsDefaultProps}
                    onAddBundles={handleAddBundles}
                    onSettingsOpen={onSettingsOpen}
                    onRenewDomain={handleRenewDomain}
                  />
                ) : (
                  <MobileView
                    {...listItemsDefaultProps}
                    onItemModalOpen={onItemModalOpen}
                  />
                )
              }
            />
          </InfiniteScroll>
        </div>
        <WelcomeComponent {...welcomeComponentProps} />
      </LayoutContainer>
      <div className={classes.actionBadge}>
        <Fio101Component {...fio101ComponentProps} />
      </div>
      <Modal
        show={showItemModal}
        onClose={onItemModalClose}
        hideCloseButton={false}
        closeButton
        isSimple
      >
        {isAddress ? (
          <FchItemComponent
            fioNameItem={selectedFioNameItem}
            warningContent={warningContent}
            onAddBundles={handleAddBundles}
            onSettingsOpen={onSettingsOpen}
          />
        ) : (
          <DomainItemComponent
            fioNameItem={selectedFioNameItem}
            warningContent={warningContent}
            onRenewDomain={handleRenewDomain}
            onSettingsOpen={onSettingsOpen}
          />
        )}
      </Modal>
      <Modal
        show={showSettingsModal}
        onClose={onSettingsClose}
        hideCloseButton={false}
        closeButton
        isSimple
        isWide={isDesktop}
        hasDefaultCloseColor
      >
        {isAddress ? (
          <FchSettingsItem
            fioNameItem={selectedFioNameItem}
            fioWallets={fioWallets}
          />
        ) : (
          <DomainSettingsItem
            fioNameItem={selectedFioNameItem}
            fioWallets={fioWallets}
          />
        )}
      </Modal>
    </div>
  );
};
