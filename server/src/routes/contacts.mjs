import { makeServiceRunner } from '../tools';

import ContactCreate from '../services/contacts/Create';
import ContactsList from '../services/contacts/List';

export default {
  create: makeServiceRunner(ContactCreate, req => req.body),
  list: makeServiceRunner(ContactsList),
};
