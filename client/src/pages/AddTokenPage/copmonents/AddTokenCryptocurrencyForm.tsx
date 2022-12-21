import React from 'react';
import { Form, Field } from 'react-final-form';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Badge from '../../../components/Badge/Badge';
import InfoBadge from '../../../components/InfoBadge/InfoBadge';
import Input from '../../../components/Input/Input';

import { BADGE_TYPES } from '../../../components/Badge/Badge';
import { INPUT_UI_STYLES } from '../../../components/Input/Input';
import { COLOR_TYPE } from '../../../components/Input/ErrorBadge';

import { AnyObject, PublicAddressDoublet } from '../../../types';

import classes from '../styles/AddToken.module.scss';

type Props = {
  initialValues: AnyObject;
  onSubmit: (data: PublicAddressDoublet) => void;
  validate: (values: PublicAddressDoublet) => AnyObject | Promise<AnyObject>;
};

export const AddTokenCryptocurrencyForm: React.FC<Props> = props => {
  const { initialValues, onSubmit, validate } = props;

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      validate={validate}
      render={formProps => (
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <form onSubmit={formProps.handleSubmit}>
          <div className={classes.modalContainer}>
            <h3 className={classes.modalTitle}>Link Details</h3>
            <InfoBadge
              type={BADGE_TYPES.ERROR}
              show
              title="Chain Code"
              message="Please verify the chain code for this token and public address is the chain you would like to use. If the chain is incorrect, your tokens will be lost."
              hasBoldMessage
            />
            <p className={classes.modalText}>
              To link a custom cryptocurrency to your FIO Cryptohandle, type in
              the token & chain codes and enter or pasted your public address.
            </p>

            <div className={classes.modalFieldContainer}>
              <Field
                name="tokenCode"
                type="text"
                component={Input}
                placeholder="Type Token Code"
                label="Token Code"
                uiType={INPUT_UI_STYLES.BLACK_WHITE}
                errorColor={COLOR_TYPE.WARN}
                disabled={!initialValues?.isCustom}
              />

              <Field
                name="chainCode"
                type="text"
                component={Input}
                placeholder="Type Chain Code"
                label="Chain Code"
                uiType={INPUT_UI_STYLES.BLACK_WHITE}
                errorColor={COLOR_TYPE.WARN}
                disabled={!initialValues?.isCustom}
              />
            </div>
            <Badge type={BADGE_TYPES.INFO} show className="noMargin">
              <FontAwesomeIcon
                className={classes.modalBadgeIcon}
                icon="exclamation-circle"
              />
              <div className={classes.modalBadgeTextContainer}>
                <span className="boldText">Hints:</span>
                <span>
                  1. To map all tokens on a chain, simply type an * in the token
                  code field.
                </span>
                <span>
                  2. You may type in any chain or token code, even if it’s not
                  listed within the chain or token code lists
                </span>
              </div>
            </Badge>

            <div className={classes.modalFieldContainer}>
              <Field
                name="publicAddress"
                type="text"
                component={Input}
                placeholder="Enter or Paste Public Address"
                label="Public Address"
                showPasteButton
                uiType={INPUT_UI_STYLES.BLACK_WHITE}
                errorColor={COLOR_TYPE.WARN}
              />
            </div>

            <div className={classes.modalButtonContainer}>
              <Button
                className={classes.modalButton}
                type="submit"
                disabled={!formProps.valid}
              >
                Add
              </Button>
            </div>
          </div>
        </form>
      )}
    />
  );
};
