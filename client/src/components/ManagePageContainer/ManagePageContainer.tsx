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
    children,
    emptyStateContent,
    listNameTitle,
    pageName,
    showTopBadge,
    title,
    topBadgeContent,
    warningContent,
    handleAddBundles,
    handleRenewDomain,
    onTopBadgeClose,
  } = props;

  const {
    fio101ComponentProps,
    fioWallets,
    hasNextPage,
    isAddress,
    isDesktop,
    isEmptyList,
    isSelectedFioNameItemExpired,
    listItemsDefaultProps,
    loading,
    noProfileLoaded,
    selectedFioNameItem,
    showItemModal,
    showSettingsModal,
    welcomeComponentProps,
    loadMore,
    onItemModalClose,
    onItemModalOpen,
    onSettingsClose,
    onSettingsOpen,
  } = useContext({
    pageName,
  });

  if (noProfileLoaded) return <Redirect to={{ pathname: ROUTES.HOME }} />;

  return (
    <div className={classes.container}>
      <NotificationBadge
        hasNewDesign
        type={topBadgeContent?.type}
        show={showTopBadge}
        message={topBadgeContent?.message}
        title={topBadgeContent?.title}
        marginBottomZero
        onClose={onTopBadgeClose}
        className={classes.topBadge}
      />
      <div className={classes.contentContainer}>
        <LayoutContainer title={title}>
          {listNameTitle && (
            <div className={classes.listNameTitle}>{listNameTitle}</div>
          )}
          <div className={classes.dataContainer}>
            {warningContent.map(content => (
              <NotificationBadge
                key={`${content.title}-${content.message}`}
                type={BADGE_TYPES.WARNING}
                title={content.title}
                message={content.message}
                show={content.show}
                withoutMargin
                onClose={content.onClose}
                className={classes.warningBadgeContainerWithMarginTop}
              />
            ))}
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
          {children}
          <WelcomeComponent {...welcomeComponentProps} />
        </LayoutContainer>
        <div className={classes.actionBadge}>
          <Fio101Component {...fio101ComponentProps} />
        </div>
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
            onAddBundles={handleAddBundles}
            onSettingsOpen={onSettingsOpen}
          />
        ) : (
          <DomainItemComponent
            fioNameItem={selectedFioNameItem}
            isDesktop={isDesktop}
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
            isExpired={isSelectedFioNameItemExpired}
          />
        ) : (
          <DomainSettingsItem
            fioNameItem={selectedFioNameItem}
            fioWallets={fioWallets}
            isExpired={isSelectedFioNameItemExpired}
          />
        )}
      </Modal>
    </div>
  );
};
