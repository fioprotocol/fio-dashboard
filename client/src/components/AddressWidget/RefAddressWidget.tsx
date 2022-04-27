import React from 'react';
import classnames from 'classnames';
import { Button } from 'react-bootstrap';

import AddressDomainForm from '../../components/AddressDomainForm';

import { REF_ACTIONS, ADDRESS } from '../../constants/common';

import classes from './AddressWidget.module.scss';

const ACTION_TEXT = {
  [REF_ACTIONS.SIGNNFT]:
    'All you have to do is add a username, select a domain and sign the NFT',
};

type Props = {
  logo: React.ReactNode;
  action: string;
  showLoginModal: () => void;
  edgeAuthLoading: boolean;
  title?: string;
  subTitle?: string;
};

const AddressWidget: React.FC<Props> = props => {
  const { logo, subTitle, action, edgeAuthLoading, showLoginModal } = props;

  const openLogin = () => showLoginModal();
  return (
    <div className={classnames(classes.container, classes.refContainer)}>
      <div className="mb-5">{logo}</div>
      <p className={classes.subtitle}>{subTitle}</p>
      <p className={classes.actionInfo}>{ACTION_TEXT[action]}</p>
      <div className={classes.form}>
        <AddressDomainForm isHomepage={true} type={ADDRESS} />
      </div>
      <div className="d-flex justify-content-center">
        <p className={classes.signInCallToAction}>
          Already have a FIO account? Sign in now!{' '}
          <Button
            className="btn btn-primary ml-lg-5 ml-md-4 ml-sm-3 pt-2 pb-2"
            size="lg"
            onClick={openLogin}
            disabled={edgeAuthLoading}
          >
            Sign in
          </Button>
        </p>
      </div>
    </div>
  );
};

export default AddressWidget;
