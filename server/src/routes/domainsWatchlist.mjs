import { makeServiceRunner } from '../tools';

import DomainsWatchlisCreate from '../services/domainsWatchlist/Create.mjs';
import DomainsWatchlisDelete from '../services/domainsWatchlist/Delete.mjs';
import DomainsWatchlisList from '../services/domainsWatchlist/List.mjs';

export default {
  create: makeServiceRunner(DomainsWatchlisCreate, req => req.body),
  delete: makeServiceRunner(DomainsWatchlisDelete, req => req.body),
  list: makeServiceRunner(DomainsWatchlisList),
};
