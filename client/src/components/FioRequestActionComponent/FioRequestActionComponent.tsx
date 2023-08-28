import React from 'react';
import { Link } from 'react-router-dom';
import ErrorIcon from '@mui/icons-material/Error';

import SubmitButton from '../common/SubmitButton/SubmitButton';

import { useContext } from './FioRequestActionComponentContext';

import { ROUTES } from '../../constants/routes';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { FIO_RECORD_TYPES } from '../../pages/WalletPage/constants';

import SendCopyImgSrc from '../../assets/images/send-copy.svg';

import classes from './FioRequestActionComponent.module.scss';

export const FioRequestActionComponent: React.FC = () => {
  const { fioPublicKeyHasRequest } = useContext();

  return (
    <div className={classes.container}>
      <img src={SendCopyImgSrc} alt="Send copy icon" className={classes.icon} />
      <h5 className={classes.title}>FIO Requests</h5>
      <p className={classes.subtitle}>Request crypto using your FIO Handle.</p>
      <Link to={ROUTES.FIO_TOKENS_REQUEST} className={classes.button}>
        <SubmitButton
          text="Send a FIO Request"
          isButtonType
          isTransparent
          isWhiteBordered
          withoutMargin
          hasSmallText
          hasLowHeight
        />
      </Link>
      {fioPublicKeyHasRequest && (
        <Link
          to={{
            pathname: ROUTES.FIO_WALLET,
            state: { fioRequestTab: FIO_RECORD_TYPES.RECEIVED },
            search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${fioPublicKeyHasRequest}`,
          }}
          className={classes.button}
        >
          <SubmitButton
            text={
              <div className={classes.respondButtonText}>
                <p className={classes.buttonText}>Respond to FIO Request</p>
                <ErrorIcon className={classes.icon} />
              </div>
            }
            isButtonType
            isTransparent
            isWhiteBordered
            hasSmallText
            hasLowHeight
          />
        </Link>
      )}
    </div>
  );
};
