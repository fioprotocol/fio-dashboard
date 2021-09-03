import React from 'react';
import classnames from 'classnames';
import AddressDomainForm from '../../components/AddressDomainForm';
import { FORM_NAMES } from '../../constants/form';

import classes from './AddressWidget.module.scss';
import { REF_ACTIONS } from '../../constants/common';
import { Link } from 'react-router-dom';

const ACTION_TEXT = {
  [REF_ACTIONS.SIGNNFT]:
    'All you have to do is add a username, select a domain and sign the NFT',
};

const AddressWidget = (props: {
  logo: React.ReactNode;
  action: string;
  showLoginModal: () => void;
  title?: string;
  subTitle?: string;
}) => {
  const { logo, subTitle, action, showLoginModal } = props;
  return (
    <div className={classnames(classes.container, classes.refContainer)}>
      <div className="mb-5">{logo}</div>
      <p className={classes.subtitle}>{subTitle}</p>
      <p className={classes.actionInfo}>{ACTION_TEXT[action]}</p>
      <div className={classes.form}>
        <AddressDomainForm isHomepage formName={FORM_NAMES.ADDRESS} />
      </div>
      <div className="d-flex justify-content-center">
        <p className={classes.signInCallToAction}>
          Already have a FIO account? Sign in now!{' '}
          <Link
            to="#"
            onClick={showLoginModal}
            className="btn btn-primary ml-lg-5 ml-md-4 ml-sm-3 pt-2 pb-2"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AddressWidget;
