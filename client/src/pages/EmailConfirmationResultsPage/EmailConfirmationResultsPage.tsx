import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button } from 'react-bootstrap';

import classes from '../../components/Modal/EmailModal/EmailModal.module.scss';

const EmailConfirmationResultsPage: React.FC = () => {
  const handleClosePage = () => window.close();

  return (
    <>
      <div className={classes.confirmBackground} />
      <div className={classes.actionModal}>
        <div className={classes.closeIcon} onClick={handleClosePage}>
          ×
        </div>
        <div className="d-flex justify-content-center my-4">
          <FontAwesomeIcon icon="list-alt" className={classes.listIcon} />
        </div>
        <div className={classes.title}>Close Browser Tab</div>
        <div className={classes.infoText}>
          Your account has been verified and your dashboard opened in a new
          browser tab.
        </div>
        <div className={classes.infoText}>Please, close this one</div>
        <Button
          onClick={handleClosePage}
          variant="outline-primary"
          size="lg"
          className={classes.closeButton}
        >
          Close
        </Button>
      </div>
    </>
  );
};

export default EmailConfirmationResultsPage;
