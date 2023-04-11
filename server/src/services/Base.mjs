import LIVR from 'livr';
import extraRules from 'livr-extra-rules';

import Exception from './Exception';
import rules from './validationRules';

LIVR.Validator.registerDefaultRules(extraRules);
LIVR.Validator.registerDefaultRules(rules);

export default class Base {
  constructor(args) {
    if (!args.context) throw new Error('CONTEXT_REQUIRED');
    this.context = args.context;
    this.res = args.res;

    for (const [method, fields] of [
      ['paramsCleanup', 'paramsSecret'],
      ['resultCleanup', 'resultSecret'],
    ]) {
      if (
        typeof this.constructor[method] !== 'function' &&
        !Array.isArray(this.constructor[fields])
      ) {
        throw new Error(
          `Service ${this.constructor.name} needs '${method}' method` +
            ` or '${fields}' list to be implemented.` +
            ' It is used for filtering sensitive data from being logged',
        );
      }
    }
  }

  async run(params) {
    await this.checkPermissions();
    const cleanParams = await this.validate(params);
    return this.execute(cleanParams);
  }

  async checkPermissions() {
    const role = this.context.role;
    const permissions = this.constructor.requiredPermissions;

    if (permissions && !permissions.includes(role)) {
      throw new Exception({
        code: 'PERMISSION_DENIED',
        fields: { role },
      });
    }
  }

  validate(data) {
    // Cache validator
    const validator =
      this.constructor.validator ||
      new LIVR.Validator(this.constructor.validationRules).prepare();
    this.constructor.validator = validator;

    return this._doValidationWithValidator(data, validator);
  }

  doValidation(data, rules) {
    const validator = new LIVR.Validator(rules).prepare();
    return this._doValidationWithValidator(data, validator);
  }

  _doValidationWithValidator(data, validator) {
    const result = validator.validate(data);

    if (!result) {
      const exception = new Exception({
        code: 'FORMAT_ERROR',
        fields: validator.getErrors(),
      });

      return Promise.reject(exception);
    }

    return Promise.resolve(result);
  }
}
