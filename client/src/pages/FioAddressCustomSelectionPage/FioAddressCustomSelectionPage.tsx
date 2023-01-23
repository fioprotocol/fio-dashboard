import React from 'react';
import { Form, Field, FormRenderProps } from 'react-final-form';
import isEmpty from 'lodash/isEmpty';

import TextInput, {
  INPUT_COLOR_SCHEMA,
  INPUT_UI_STYLES,
} from '../../components/Input/TextInput';
import InfoBadge from '../../components/InfoBadge/InfoBadge';
import PseudoModalContainer from '../../components/PseudoModalContainer';

import { BADGE_TYPES } from '../../components/Badge/Badge';
import EditableSelect from '../../components/Input/EditableSelect/EditableSelect';
import { Label } from '../../components/Input/StaticInputParts';

import { SelectedItemComponent } from './components/SelectedItemComponent';

import { useContext } from './FioAddressCustomSelectionPageContext';

import { DEFAULT_DEBOUNCE_TIMEOUT } from '../../constants/timeout';

import { FIO_ADDRESS_DELIMITER } from '../../utils';

import { formValidation } from './validation';

import classes from './FioAddressCustomSelectionPage.module.scss';

const ADDRESS_FIELD_NAME = 'address';
const DOMAIN_FIELD_NAME = 'domain';

type FormValues = { address: string; domain: string };

const FioAddressCustomSelectionPage: React.FC = () => {
  const {
    allDomains,
    domainsLoaing,
    initialValues,
    isDesktop,
    link,
    options,
    shouldPrependUserDomains,
    onClick,
  } = useContext();

  return (
    <PseudoModalContainer
      title=""
      link={link}
      middleWidth
      hasDesertStormBackground
    >
      <div className={classes.container}>
        <h4 className={classes.title}>Add Custom Ending</h4>
        <p className={classes.subtitle}>
          Want to create your own unique FIO Crypto Handle? Enter a custom
          ending to get started.
        </p>
        <Form
          onSubmit={() => null}
          validate={formValidation.validateForm}
          initialValues={initialValues}
        >
          {(props: FormRenderProps<FormValues>) => {
            const {
              errors,
              touched,
              validating,
              valid,
              values: { address, domain },
            } = props;

            let error = '';
            if (!!errors.domain && touched.domain) {
              error = errors.domain;
            }

            if (!!errors.address && touched.address) {
              error = errors.address;
            }

            return (
              <>
                <form>
                  <Field
                    name={ADDRESS_FIELD_NAME}
                    type="text"
                    placeholder="Enter a Username"
                    colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                    component={TextInput}
                    hideError="true"
                    lowerCased
                    loading={validating}
                    disabled={validating || domainsLoaing}
                    debounceTimeout={DEFAULT_DEBOUNCE_TIMEOUT}
                  />
                  {shouldPrependUserDomains ? (
                    <>
                      <Label
                        uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                        label="Custom Ending"
                        hasItalic
                      />
                      <Field
                        type="dropdown"
                        name={DOMAIN_FIELD_NAME}
                        component={EditableSelect}
                        options={options}
                        placeholder="Enter Custom Ending"
                        uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                        inputPrefix={FIO_ADDRESS_DELIMITER}
                        actionButtonText="Add Custom Ending"
                        noShadow
                        containerHasFullWidth
                        hasMarginBottom
                      />
                    </>
                  ) : (
                    <Field
                      name={DOMAIN_FIELD_NAME}
                      type="text"
                      placeholder="Enter Custom Ending"
                      label="Custom Ending"
                      colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                      uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                      component={TextInput}
                      lowerCased
                      hideError="true"
                      prefix={FIO_ADDRESS_DELIMITER}
                      loading={validating}
                      disabled={validating || domainsLoaing}
                      hasItalicLabel
                      debounceTimeout={DEFAULT_DEBOUNCE_TIMEOUT}
                    />
                  )}
                </form>
                <SelectedItemComponent
                  allDomains={allDomains}
                  address={address}
                  domain={domain}
                  show={valid}
                  isDesktop={isDesktop}
                  onClick={onClick}
                />
                <div className={classes.erroInfoBadge}>
                  <InfoBadge
                    title="Try again!"
                    message={error}
                    show={
                      !isEmpty(errors) &&
                      Object.values(touched).some(tochedField => !!tochedField)
                    }
                    type={BADGE_TYPES.ERROR}
                  />
                </div>
              </>
            );
          }}
        </Form>
      </div>
    </PseudoModalContainer>
  );
};

export default FioAddressCustomSelectionPage;
