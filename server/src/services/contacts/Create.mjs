import Base from '../Base';
import X from '../Exception';

import { Contact, Var } from '../../models';

import { VARS_KEYS } from '../../config/constants';

export default class ContactCreate extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            name: 'string',
          },
        },
      ],
    };
  }

  async execute({ data: { name } }) {
    const userId = this.context.id;

    const existing = await Contact.getItem({ name, userId });
    if (existing && existing.id) return { data: null };

    const maxContacts = Number(await Var.getValByKey(VARS_KEYS.MAX_CONTACTS_PER_USER));
    if (maxContacts) {
      const contactCount = await Contact.count({ where: { userId } });
      if (contactCount >= maxContacts) {
        throw new X({
          code: 'LIMIT_EXCEEDED',
          fields: {
            contact: 'MAX_CONTACTS_REACHED',
          },
        });
      }
    }

    const contact = new Contact({ name, userId });

    await contact.save();

    return {
      data: Contact.format(contact.get({ plain: true })),
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
