import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';

import InfoBadge from '../../components/InfoBadge/InfoBadge';
import { DataValue } from '../../components/FioTokensReceive/components/DataValue';
import SubmitButton from '../../components/common/SubmitButton/SubmitButton';
import { AffiliateModal } from './components/AffiliateModal';
import { DomainList } from './components/DomainList';

import { ROUTES } from '../../constants/routes';
import { BADGE_TYPES } from '../../components/Badge/Badge';

import { useContext } from './FioAffiliateProgramPageContext';

import classes from './styles/FioAffiliateProgramPage.module.scss';
import Loader from '../../components/Loader/Loader';
import Modal from '../../components/Modal/Modal';
import { DomainItemComponent } from './components/ItemsScreenView/ModalItemComponent';

const FioAffiliateProgramPage: React.FC = () => {
  const {
    loading,
    isDesktop,
    showModal,
    onOpenModal,
    onCloseModal,
    showItemModal,
    onItemModalOpen,
    onItemModalClose,
    fioAddresses,
    onAffiliateUpdate,
    handleSelect,
    handleRenewDomain,
    handleVisibilityChange,
    domains,
    selectedFioDomain,
    user,
    link,
    fchLink,
    tpid,
  } = useContext();
  const noDomains = !domains.length;
  const noDomainSelected = !user.affiliateProfile?.settings?.domains?.length;

  if (loading) return <Loader />;

  return (
    <div className={classes.container}>
      <div className={classes.textContainer}>
        <h1 className={classes.title}>
          FIO Affiliate Program{' '}
          <span className={classes.activeBadge}>ACTIVE</span>
        </h1>

        <div className="boldText mt-4 h6">Payment Information</div>
        <InfoBadge
          className="mt-2 mb-2"
          type={BADGE_TYPES.INFO}
          show
          title="Transaction Payments"
          message="Earnings are paid out every time you reach 100 FIO. These will be paid and displayed in your wallet associated with the FIO Handle selected below."
        />

        <div className={classes.fieldsContainer}>
          <div className={classes.field}>
            <div className={classes.description}>
              Your affiliate program earnings are being paid to this handle
            </div>
            <div className={classes.input} onClick={onOpenModal}>
              {tpid}
              <ChevronRightOutlinedIcon className={classes.icon} />
            </div>
          </div>
        </div>

        <div className="boldText mt-4 h6">Domain Registration</div>
        <div className={classes.text}>
          Invite friends to FIO Protocol. For every domain registration made
          through your link, you earn <span className="throughText">10%</span>{' '}
          50% of that purchase value.
        </div>

        <div className={classes.text}>
          For additional details,{' '}
          <Link to={ROUTES.FIO_AFFILIATE_PROGRAM_LANDING}>
            please click here
          </Link>
          .
        </div>

        <p className={classes.info}>
          Please Note: Payouts are only made on the first year of new domain
          registration, even if registration is made for multiple years.
        </p>

        <div className={classes.fieldsContainer}>
          <div className={classes.field}>
            <div className={classes.label}>
              Domain Affiliate Program Referral Link
            </div>
            <div className={classes.description}>
              Please use this referral link.
            </div>
            <div className={classes.input}>
              <DataValue value={link} />
            </div>
          </div>
        </div>

        <div className="boldText mt-4 h6">FIO Handle Registration</div>
        <div className={classes.text}>
          Allow users to register FIO handles on your available domains.
        </div>

        <div className={classes.fieldsContainer}>
          <div className={classes.field}>
            <div className={classes.label}>
              FIO Handle Registration Referral Link
            </div>
            <div className={classes.description}>
              Please use this referral link.
            </div>
            {noDomainSelected && (
              <InfoBadge
                className="mt-2 mb-2"
                type={BADGE_TYPES.WARNING}
                show
                title="Select Domains"
                message="You must select at least one domain below for your affiliate link to be active."
              />
            )}
            <div
              className={classNames(
                classes.input,
                (noDomains || noDomainSelected) && classes.disabled,
              )}
            >
              <DataValue
                value={fchLink}
                disabled={noDomains || noDomainSelected}
              />
            </div>
          </div>
        </div>

        <div className={classes.fieldsContainer}>
          <div className={classes.field}>
            <div className={classes.label}>Registration Domains</div>
            <div className={classes.description}>
              Select which domains paid registrations are allowed.
            </div>
            {noDomains ? (
              <InfoBadge
                className="mt-2 mb-2"
                type={BADGE_TYPES.WARNING}
                show
                title="No Available Domains"
                message="You must own and make domains public for users to be able to register FIO Handles on them."
              />
            ) : (
              <InfoBadge
                className="mt-2 mb-2"
                type={BADGE_TYPES.INFO}
                show
                title="Private Domains"
                message="Domains must be public for users to be able to register FIO Handles on those domains."
              />
            )}
            <DomainList
              domains={domains}
              loading={false}
              onItemModalOpen={onItemModalOpen}
              handleRenewDomain={handleRenewDomain}
              handleVisibility={handleVisibilityChange}
              handleSelect={handleSelect}
              isDesktop={isDesktop}
            />
          </div>
        </div>
        {noDomains && (
          <Link to={ROUTES.FIO_DOMAIN} className="d-inline-block">
            <SubmitButton
              hasAutoWidth
              withoutMargin
              hasNoSidePaddings
              text="Purchase Domains"
            />
          </Link>
        )}
      </div>
      {/*<div className={classes.videoContainer} />*/}
      <AffiliateModal
        showModal={showModal}
        onCloseModal={onCloseModal}
        fioAddresses={fioAddresses}
        onAffiliateUpdate={onAffiliateUpdate}
        user={user}
      />

      <Modal
        show={showItemModal}
        onClose={onItemModalClose}
        hideCloseButton={false}
        closeButton
        isSimple
      >
        <DomainItemComponent
          fioDomain={selectedFioDomain}
          isDesktop={isDesktop}
          onRenewDomain={handleRenewDomain}
          onVisibilityChange={handleVisibilityChange}
        />
      </Modal>
    </div>
  );
};

export default FioAffiliateProgramPage;
