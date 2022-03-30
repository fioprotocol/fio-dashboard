import jwt from 'jsonwebtoken';

import config from '../../config';

export function generate(payload, expires) {
  const expiresIn =
    expires && typeof expires === 'object'
      ? Math.round((expires.getTime() - new Date().getTime()) / 1000)
      : null;

  const options = Object.assign({}, config.jwt.options, expiresIn ? { expiresIn } : {});
  return jwt.sign(payload, config.jwt.secret, options);
}

export function verify(token) {
  token = token.replace('Bearer ', '').trim();
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt.secret, config.jwt.options, function(err, data) {
      if (!err) return resolve(data);

      if (err.name === 'TokenExpiredError') {
        reject('TOKEN_EXPIRED');
      } else {
        reject('INVALID_TOKEN');
      }
    });
  });
}
