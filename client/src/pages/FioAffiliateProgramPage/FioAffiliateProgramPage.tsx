import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import InfoBadge from '../../components/InfoBadge/InfoBadge';
import { DataValue } from '../../components/FioTokensReceive/components/DataValue';
import { AffiliateModal } from './components/AffiliateModal';

import { ROUTES } from '../../constants/routes';
import { BADGE_TYPES } from '../../components/Badge/Badge';

import { useContext } from './FioAffiliateProgramPageContext';

import classes from './styles/FioAffiliateProgramPage.module.scss';

const FioAffiliateProgramPage: React.FC = () => {
  const {
    showModal,
    onOpenModal,
    onCloseModal,
    fioAddresses,
    onAffiliateUpdate,
    user,
    link,
    tpid,
  } = useContext();

  return (
    <div className={classes.container}>
      <div className={classes.textContainer}>
        <h1 className={classes.title}>
          FIO Domain Affiliate Program{' '}
          <span className={classes.activeBadge}>Active</span>
        </h1>

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
          <div className={classes.field}>
            <div className={classes.label}>FIO Handle</div>
            <div className={classes.description}>
              Your affiliate program earnings are being paid to this handle
            </div>
            <div className={classes.input} onClick={onOpenModal}>
              {tpid}
              <FontAwesomeIcon className={classes.icon} icon="chevron-right" />
            </div>
          </div>
        </div>

        <div className="boldText">Payment Information</div>
        <InfoBadge
          type={BADGE_TYPES.INFO}
          show
          title="Transaction Payments"
          message="Earnings are paid out every time you reach 100 FIO. These will be paid and displayed in your wallet associated with the FIO Handle selected above."
        />
      </div>
      <div className={classes.videoContainer} />
      <AffiliateModal
        showModal={showModal}
        onCloseModal={onCloseModal}
        fioAddresses={fioAddresses}
        onAffiliateUpdate={onAffiliateUpdate}
        user={user}
      />
    </div>
  );
};

export default FioAffiliateProgramPage;
