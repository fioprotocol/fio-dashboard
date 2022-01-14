import Base from '../Base';

import { Contact } from '../../models';

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
    const existing = await Contact.getItem({
      name,
      userId: this.context.id,
    });
    if (existing && existing.id) return { data: null };
    const contact = new Contact({
      name,
      userId: this.context.id,
    });

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
