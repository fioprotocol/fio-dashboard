import { makeServiceRunner } from '../tools';

import AvailableDomainsList from '../services/defaults/AvailableDomainsList';

export default {
  getAvailableDomains: makeServiceRunner(AvailableDomainsList),
};
