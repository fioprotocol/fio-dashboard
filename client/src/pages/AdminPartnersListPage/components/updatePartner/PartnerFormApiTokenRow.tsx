import React from 'react';
import { Field } from 'react-final-form';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import Input, { INPUT_UI_STYLES } from '../../../../components/Input/Input';

import { copyToClipboard } from '../../../../util/general';

import classes from '../../AdminPartnersListPage.module.scss';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';

type Props = {
  field: string;
  index: number;
  token: string;
  legacyHash?: boolean;
  onRegenerate: () => void;
  onRemove: () => void;
};

export const PartnerFormApiTokenRow: React.FC<Props> = props => {
  const { field, token, legacyHash, onRegenerate, onRemove } = props;

  return (
    <>
      <div
        className={classnames(
          classes.landingTextsContainer,
          'd-flex',
          'flex-column',
          'align-self-start',
          'w-100',
          'mb-3',
        )}
      >
        <span className={classes.label}>Api Token</span>
        <Field name="apiToken">{() => null}</Field>
        <div className={classes.apiTokenWrapper}>
          <div>
            <span className={classes.apiToken}>{token}</span>
            {!token && legacyHash && (
              <span className={classnames(classes.apiToken, 'font-italic')}>
                Legacy hash is set
              </span>
            )}
            <div className="mt-3">
              <div className="d-flex justify-content-between align-items-center">
                <span className={classnames(classes.label, 'w-50', 'mb-4')}>
                  Daily Limit:
                </span>
                <Field
                  type="number"
                  id={`${field}-daily-limit`}
                  component={Input}
                  name={`${field}.dailyFreeLimit`}
                  uiType={INPUT_UI_STYLES.BLACK_WHITE}
                  errorColor={COLOR_TYPE.WARN}
                />
              </div>
              <Field
                type="checkbox"
                id={`${field}-access`}
                component={Input}
                name={`${field}.access`}
                label="Access"
              />
            </div>
          </div>
          <div>
            <Button
              size="sm"
              className="autosize ml-2 mb-0"
              onClick={() => copyToClipboard(token)}
            >
              <FontAwesomeIcon icon="copy" />
            </Button>
            <Button
              size="sm"
              className="autosize ml-2 mb-0"
              onClick={onRegenerate}
            >
              <FontAwesomeIcon icon="sync" />
            </Button>
            <Button
              size="sm"
              variant="danger"
              className="autosize ml-2 mb-0"
              onClick={onRemove}
            >
              <FontAwesomeIcon icon="trash" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
