import React, { useCallback } from 'react';

import { Form, Field } from 'react-final-form';

import Modal from '../../../../components/Modal/Modal';
import TextInput, {
  INPUT_COLOR_SCHEMA,
  INPUT_UI_STYLES,
} from '../../../../components/Input/TextInput';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import CommonBadge from '../../../../components/Badges/CommonBadge/CommonBadge';
import Badge, { BADGE_TYPES } from '../../../../components/Badge/Badge';
import { PriceComponent } from '../../../../components/PriceComponent';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';

import { formValidation } from './validation';

import { DOMAIN_TYPE, DOMAIN_TYPE_PARAMS } from '../../../../constants/fio';
import { DOMAIN_IS_NOT_EXIST } from '../../../../constants/errors';

import { DomainWatchlistItem } from '../../../../types';

import classes from './AddDomainToWatchListModal.module.scss';

type Props = {
  domainsWatchlistList: DomainWatchlistItem[];
  loading: boolean;
  prices: {
    costFio: string;
    costUsdc: string;
  };
  showModal: boolean;
  domainWatchlistItemCreate: (domain: string) => void;
  onClose: () => void;
  onPurchaseButtonClick: (domain: string) => void;
};

type FormProps = {
  domain: string;
};

export const AddDomainToWatchListModal: React.FC<Props> = props => {
  const {
    domainsWatchlistList,
    loading,
    prices,
    showModal,
    domainWatchlistItemCreate,
    onClose,
    onPurchaseButtonClick,
  } = props;

  const onSubmit = useCallback(
    (values: FormProps) => {
      domainWatchlistItemCreate(values.domain);
    },
    [domainWatchlistItemCreate],
  );

  return (
    <Modal
      closeButton
      hasDefaultCloseColor
      isMiddleWidth
      isWhite
      show={showModal}
      onClose={onClose}
    >
      <div className={classes.modalContainer}>
        <h3 className={classes.title}>Add to Watchlist</h3>
        <p className={classes.subtitle}>
          Add a domain to your watchlist by simply entering or pasting the
          domain name.
        </p>
        <h4 className={classes.formTitle}>Domain Name</h4>
        <Form
          onSubmit={onSubmit}
          validate={values =>
            formValidation.validateForm({
              ...values,
              domainsWatchlistList: domainsWatchlistList,
            })
          }
        >
          {formProps => {
            const {
              dirtyFields,
              errors,
              hasValidationErrors,
              touched,
              visited,
              validating,
              values,
              handleSubmit,
            } = formProps;
            const domainIsNotExist = errors.domain === DOMAIN_IS_NOT_EXIST;

            const hasDomainError =
              !!errors.domain &&
              (touched.domain || visited.domain) &&
              !validating &&
              dirtyFields.domain;

            return (
              <form className={classes.form} onSubmit={handleSubmit}>
                <Field
                  colorSchema={INPUT_COLOR_SCHEMA.BLACK_AND_GRAY}
                  component={TextInput}
                  debounceTimeout={500}
                  errorColor={COLOR_TYPE.WARN}
                  hasErrorForced={hasDomainError}
                  lowerCased
                  name="domain"
                  placeholder="Enter a Domain Name"
                  showPasteButton
                  type="text"
                  uiType={INPUT_UI_STYLES.BLACK_GRAY}
                  useErrorBlockIcon
                />

                {domainIsNotExist && hasDomainError ? (
                  <div className={classes.purchaseConntainer}>
                    <h4 className={classes.formTitle}>Purchase Domain</h4>
                    <Badge
                      show
                      type={BADGE_TYPES.SIMPLE}
                      className={classes.badgeContainer}
                    >
                      <CommonBadge isRed>
                        <div className={classes.text}>
                          {DOMAIN_TYPE_PARAMS[DOMAIN_TYPE.CUSTOM].title}
                        </div>
                      </CommonBadge>
                      <PriceComponent {...prices} />
                    </Badge>
                    <SubmitButton
                      text="Purchase Now"
                      onClick={() => onPurchaseButtonClick(values.domain)}
                    />
                  </div>
                ) : (
                  <SubmitButton
                    text="Add to Watchlist"
                    disabled={hasValidationErrors}
                    loading={loading}
                  />
                )}
              </form>
            );
          }}
        </Form>
      </div>
    </Modal>
  );
};
