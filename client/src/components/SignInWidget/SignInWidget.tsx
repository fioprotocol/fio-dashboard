import React from 'react';
import { Button } from 'react-bootstrap';

import classes from './SignInWidget.module.scss';

type Props = {
  edgeAuthLoading: boolean;
  show: boolean;
  showLoginModal: () => void;
};

const SignInWidget: React.FC<Props> = props => {
  const { showLoginModal, edgeAuthLoading, show } = props;

  if (!show) return null;

  const openLogin = () => showLoginModal();
  return (
    <div className="d-flex justify-content-center">
      <p className={classes.signInCallToAction}>
        Already have a FIO account? Sign in now!{' '}
        <Button
          className="btn btn-primary ml-lg-3 ml-md-2 mt-3 ml-sm-1 pt-2 pb-2"
          size="lg"
          onClick={openLogin}
          disabled={edgeAuthLoading}
        >
          Sign in
        </Button>
      </p>
    </div>
  );
};

export default SignInWidget;
