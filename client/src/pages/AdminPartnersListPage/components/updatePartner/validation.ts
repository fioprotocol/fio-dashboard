import { AnyObject, RefProfile } from '../../../../types';

export const validate = (values: RefProfile): AnyObject => {
  const errors: AnyObject = {
    settings: {
      domains: [],
    },
  };

  if (!values.label) {
    errors.label = 'Required.';
  }
  if (!values.code) {
    errors.code = 'Required.';
  }
  if (values.settings?.domains) {
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
