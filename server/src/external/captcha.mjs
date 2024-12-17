import Geetest from 'gt3-sdk';

const captcha = new Geetest({
  geetest_id: process.env.GEETEST_ID,
  geetest_key: process.env.GEETEST_KEY,
});

export const registerCaptcha = () =>
  new Promise((resolve, reject) => {
    captcha.register(null, (err, data) => {
      if (err) {
        return reject(err);
      }

      if (!data.success) {
        resolve(data);
      } else {
        // todo:
        resolve(data);
      }
    });
  });

export const validate = async params => {
  const { geetest_challenge, geetest_validate, geetest_seccode } = params;
  if (!geetest_challenge || !geetest_validate || !geetest_seccode) return false;
  return new Promise((resolve, reject) => {
    captcha.validate(
      false,
      {
        geetest_challenge,
        geetest_validate,
        geetest_seccode,
      },
      (err, success) => {
        if (err) {
          return reject(err);
        } else if (!success) {
          return resolve(false);
        } else {
          return resolve(true);
        }
      },
    );
  });
};
