import React from 'react';

import EmailConfirmBlocker from '../../components/Modal/EmailConfirmBlocker';

import classes from '../../components/AuthContainer/AuthContainer.module.scss';

const EmailConfirmGate: React.FC = () => (
  <div
    className={`${classes.container} w-100 d-flex justify-content-center align-items-center`}
  >
    <EmailConfirmBlocker />
  </div>
);

export default EmailConfirmGate;
