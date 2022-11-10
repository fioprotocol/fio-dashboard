import { AnyObject, RefProfile } from '../../../../types';
import { URL_REGEXP } from '../../../../constants/regExps';

export const validate = (values: RefProfile): AnyObject => {
  const errors: AnyObject = {
    settings: {},
  };

  if (!values.label) {
    errors.label = 'Required.';
  }
  if (!values.code) {
    errors.code = 'Required.';
  }
  if (values.settings?.link && !URL_REGEXP.test(values.settings.link)) {
    errors.settings.link = 'Invalid URL.';
  }
  if (values.settings?.domains?.length) {
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
