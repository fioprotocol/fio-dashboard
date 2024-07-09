import { makeServiceRunner } from '../tools';

import WrapTokensList from '../services/wrapStatus/WrapTokensList.mjs';
import WrapDomainsList from '../services/wrapStatus/WrapDomainsList.mjs';
import UnwrapDomainsList from '../services/wrapStatus/UnwrapDomainsList.mjs';
import UnwrapTokensList from '../services/wrapStatus/UnwrapTokensList.mjs';
import BurnedDomainsList from '../services/wrapStatus/BurnedDomainsList.mjs';

export default {
  wrapTokens: makeServiceRunner(WrapTokensList, req => req.query),
  wrapDomains: makeServiceRunner(WrapDomainsList, req => req.query),
  unwrapTokens: makeServiceRunner(UnwrapTokensList, req => req.query),
  unwrapDomains: makeServiceRunner(UnwrapDomainsList, req => req.query),
  burnedDomains: makeServiceRunner(BurnedDomainsList, req => req.query),
};
