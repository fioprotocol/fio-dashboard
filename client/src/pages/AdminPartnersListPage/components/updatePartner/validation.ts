import { AnyObject, RefProfile } from '../../../../types';
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
    errors.settings.domains = values.settings.domains.map((domain, index) =>
      domain
        ? values.settings.domains.slice(0, index).includes(domain)
          ? 'Domain Not Unique'
          : undefined
        : 'Required.',
    );
    if (!errors.settings.domains.filter(Boolean).length) {
      delete errors.settings.domains;
    }
  }

  return errors;
};
