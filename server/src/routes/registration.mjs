import { makeServiceRunner } from '../tools';

import DomainsList from '../services/registration/DomainsList.mjs';

export default {
  domainsList: makeServiceRunner(DomainsList),
};
