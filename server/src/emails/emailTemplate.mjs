import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

const emailTemplatesPath = path.resolve('server/src/emails/');

export const templates = {
  createAccount: 'createAccount',
};

class EmailTemplate {
  constructor() {}

  get(templateName, params) {
    const source = fs.readFileSync(
      `${emailTemplatesPath}/${templateName}/${templateName}.hbs`,
      'utf-8',
    );
    const template = handlebars.compile(source);

    return template(params);
  }
}

export default new EmailTemplate();
