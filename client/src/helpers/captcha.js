export const initCaptcha = data =>
  new Promise((resolve, reject) => {
    window.initGeetest(
      {
        gt: data.gt,
        challenge: data.challenge,
        offline: !data.success,
        new_captcha: true,
        lang: 'en',
        product: 'bind',
        width: '400px',
      },
      captchaObj => {
        captchaObj
          .onReady(() => {
            resolve(captchaObj);
          })
          .onError(() => {
            reject();
          });
      },
    );
  });

export const verifyCaptcha = captchaObj =>
  new Promise((resolve, reject) => {
    captchaObj.verify();
    captchaObj.onSuccess(() => {
      const result = captchaObj.getValidate();
      if (!result) {
        return alert('Please complete verification');
      }

      const captchaParams = {
        success: true,
        verifyParams: {
          geetest_challenge: result.geetest_challenge,
          geetest_validate: result.geetest_validate,
          geetest_seccode: result.geetest_seccode,
        },
      };
      resolve(captchaParams);
    });
    captchaObj.onError(e => {
      reject(e);
    });
    captchaObj.onClose(e => {
      captchaObj.reset();
      reject(e);
    });
  });
