import React from 'react';

import classnames from 'classnames';

import NotificationBadge from '../../components/NotificationBadge';
import PseudoModalContainer from '../../components/PseudoModalContainer';
import FioName from '../../components/common/FioName/FioName';

import { ActionButtons } from './components/ActionButtons';
import { FioSocialMediaLinksList } from './components/FioSocialMediaLinksList';

import { ROUTES } from '../../constants/routes';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import { SOCIAL_MEDIA_LINKS } from '../../constants/socialMediaLinks';

import { useContext } from './FioSocialMediaLinksPageContext';

import classes from './FioSocialMediaLinksPage.module.scss';

const NOTIFICATION_BADGE = {
  title: 'Why link your social media accounts?',
  message: (
    <p className={classes.message}>
      When you link your FIO Crypto Handles to your social media accounts, that
      information is recorded on chain.This ensures, that all of your socila
      media accounts are connected, vierified and controlled by you.
    </p>
  ),
};

const FioSocialMediaLinksPage: React.FC = () => {
  const {
    fch,
    loading,
    search,
    socialMediaLinks,
    showBadge,
    successBadgeMessage,
    onClose,
    onBadgeClose,
  } = useContext();

  return (
    <div className={classes.container}>
      <NotificationBadge
        message={successBadgeMessage}
        noDash
        hasNewDesign
        onClose={onBadgeClose}
        show={!!successBadgeMessage}
        title="Success"
        type={BADGE_TYPES.INFO}
      />
      <PseudoModalContainer
        title="FIO Crypto Handle Social Media Linking"
        link={ROUTES.FIO_ADDRESSES}
        hasAutoWidth
        containerClass={successBadgeMessage && classes.modalContainer}
      >
        <div className={classes.dataContainer}>
          <NotificationBadge
            message={NOTIFICATION_BADGE.message}
            noDash
            onClose={onClose}
            show={showBadge}
            title={NOTIFICATION_BADGE.title}
            type={BADGE_TYPES.INFO}
          />
          <div className="mt-4">
            <FioName name={fch} />
          </div>
          <div
            className={classnames(
              classes.actionContainer,
              classes.columnMobile,
            )}
          >
            <h5 className={classnames(classes.subtitle, classes.hasMargin)}>
              Linked Social Media Accounts
            </h5>
            <ActionButtons
              search={search}
              isDisabled={socialMediaLinks?.length === 0}
              isAddDisabled={
                socialMediaLinks?.length === SOCIAL_MEDIA_LINKS.length
              }
            />
          </div>
          <FioSocialMediaLinksList
            socialMediaLinks={socialMediaLinks}
            loading={loading}
          />
        </div>
      </PseudoModalContainer>
    </div>
  );
};

export default FioSocialMediaLinksPage;
