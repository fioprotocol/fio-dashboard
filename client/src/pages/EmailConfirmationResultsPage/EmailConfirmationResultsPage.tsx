import React from 'react';
import classnames from 'classnames';

import windowCloseImageSrc from '../../assets/images/tab.svg';

import classes from '../../components/Modal/EmailModal/EmailModal.module.scss';

const EmailConfirmationResultsPage: React.FC = () => (
  <>
    <div className={classes.confirmBackground} />
    <div className={classnames(classes.actionModal, classes.hasWideWidth)}>
      <div className="d-flex justify-content-center my-4">
        <img alt="Window tab icon" src={windowCloseImageSrc} />
      </div>
      <div className={classes.title}>Close Browser Tab</div>
      <div className={classes.infoText}>
        Your account has been verified and your dashboard opened in a new
        browser tab.
      </div>
      <div className={classnames(classes.infoText, classes.boldInfoText)}>
        Please, close this tab by clicking the X on this browser tab.
      </div>
    </div>
  </>
);

export default EmailConfirmationResultsPage;
