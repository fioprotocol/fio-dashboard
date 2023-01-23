import { AnyObject, RefProfile, RefProfileDomain } from '../../../../types';
import { URL_REGEXP } from '../../../../constants/regExps';
import { REF_PROFILE_TYPE } from '../../../../constants/common';

export const validate = (values: RefProfile): AnyObject => {
  const errors: AnyObject = {
    settings: {},
  };

  const isReferrer = values.type === REF_PROFILE_TYPE.REF;
  if (!values.type) {
    errors.type = 'Required.';
  }
  if (!values.label) {
    errors.label = 'Required.';
  }
  if (!values.code) {
    errors.code = 'Required.';
  }
  if (isReferrer && !values.regRefCode) {
    errors.regRefCode = 'Required.';
  }
  if (isReferrer && !values.regRefApiToken) {
    errors.regRefApiToken = 'Required.';
  }
  if (!isReferrer && !values.tpid) {
    errors.tpid = 'Required.';
  }
  if (
    isReferrer &&
    values.settings?.link &&
    !URL_REGEXP.test(values.settings.link)
  ) {
    errors.settings.link = 'Invalid URL.';
  }

  if (isReferrer && values.settings?.domains?.length) {
    errors.settings.domains = values.settings.domains.map(
      (domain: RefProfileDomain, index) => {
        if (domain.name) {
          const domainExistsInTheList = values.settings.domains
            .slice(0, index)
            .find(d => domain.name === d.name);
          return domainExistsInTheList ? 'Domain Not Unique' : undefined;
        }
        return 'Required.';
      },
    );

    const domainsContainErrors = errors.settings.domains.filter(Boolean);
    if (!domainsContainErrors) {
      delete errors.settings.domains;
    }
  }

  return errors;
};
