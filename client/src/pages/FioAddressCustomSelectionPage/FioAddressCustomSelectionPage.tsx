import React from 'react';
import { Form, Field, FormRenderProps } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';

import TextInput, {
  INPUT_COLOR_SCHEMA,
  INPUT_UI_STYLES,
} from '../../components/Input/TextInput';
import InfoBadge from '../../components/InfoBadge/InfoBadge';
import PseudoModalContainer from '../../components/PseudoModalContainer';

import { BADGE_TYPES } from '../../components/Badge/Badge';
import { CustomDomainDropdown } from '../../components/Input/CustomDomainDropdown';

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
    domainsLoading,
    closedInitialDropdown,
    initialValues,
    isDesktop,
    link,
    options,
    removeFilter,
    shouldPrependUserDomains,
    onClick,
    onFieldChange,
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
          Want to create your own unique FIO Handle? Enter a custom ending to
          get started.
        </p>
        <Form
          onSubmit={() => null}
          validate={values =>
            formValidation.validateForm({
              ...values,
              userDomains: allDomains.userDomains,
              gatedDomains: allDomains.allRefProfileDomains?.filter(
                refPorfileDomain => refPorfileDomain.hasGatedRegistration,
              ),
            })
          }
          initialValues={initialValues}
        >
          {(props: FormRenderProps<FormValues>) => {
            const {
              dirtyFields,
              errors,
              form,
              touched,
              validating,
              valid,
              values: { address, domain },
              visited,
            } = props;

            let error = '';

            const hasAddressError =
              !!errors.address &&
              (touched.address || visited.address || initialValues.address) &&
              !validating &&
              dirtyFields.address;

            const hasDomainError =
              !!errors.domain &&
              (touched.domain || visited.domain || initialValues.domain) &&
              !validating &&
              dirtyFields.domain;

            if (hasDomainError) {
              error = errors.domain;
            }
            if (hasAddressError) {
              error = errors.address;
            }

            const onBlur = () => {
              form.blur(DOMAIN_FIELD_NAME);
            };

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
                    disabled={domainsLoading}
                    debounceTimeout={DEFAULT_DEBOUNCE_TIMEOUT}
                    hasErrorForced={hasAddressError}
                  />
                  <OnChange name={ADDRESS_FIELD_NAME}>{onFieldChange}</OnChange>
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
                        component={CustomDomainDropdown}
                        options={options}
                        placeholder="Enter Custom Ending"
                        uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                        inputPrefix={FIO_ADDRESS_DELIMITER}
                        hasErrorForced={hasDomainError}
                        onBlur={onBlur}
                        actionButtonText="Add Custom Ending"
                        defaultMenuIsOpen={!closedInitialDropdown}
                        removeFilter={removeFilter}
                        containerHasFullWidth
                        hasMarginBottom
                        hideError
                        noShadow
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
                      disabled={domainsLoading}
                      hasItalicLabel
                      debounceTimeout={DEFAULT_DEBOUNCE_TIMEOUT}
                      hasErrorForced={hasDomainError}
                    />
                  )}
                </form>
                <SelectedItemComponent
                  allDomains={allDomains}
                  address={address}
                  domain={domain}
                  show={address && domain && valid}
                  isDesktop={isDesktop}
                  onClick={onClick}
                />
                <div className={classes.erroInfoBadge}>
                  <InfoBadge
                    title="Try again!"
                    message={error}
                    show={!!error}
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
