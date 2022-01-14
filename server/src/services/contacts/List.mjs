import Base from '../Base';

import { Contact } from '../../models';

export default class ContactsList extends Base {
  async execute() {
    const contacts = await Contact.list({ userId: this.context.id });

    return {
      data: contacts.map(contact => Contact.format(contact.get({ plain: true }))),
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
