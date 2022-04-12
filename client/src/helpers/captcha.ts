import { FioRegCaptchaResponse } from '../api/responses';

// @ts-ignore
// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
type GeetestInitOptions = {
  gt?: string;
  challenge?: string;
  offline: boolean;
  new_captcha: boolean;
  lang: string;
  product: string;
  width: string;
};

type VerifyParams = {
  geetest_challenge: string;
  geetest_validate: string;
  geetest_seccode: string;
};

type CaptchaObj = {
  verify: () => void;
  reset: () => void;
  getValidate: () => VerifyParams | null;
  onSuccess: (cb: () => void) => void;
  onReady: (cb: () => void) => void;
  onError: (cb: (e: Error) => void) => void;
  onClose: (cb: (e: Error) => void) => void;
};

export const initCaptcha = (data: FioRegCaptchaResponse): Promise<CaptchaObj> =>
  new Promise((resolve, reject) => {
    if (window.initGeetest == null) reject('Geetest init error');

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
      (captchaObj: CaptchaObj) => {
        captchaObj.onReady(() => {
          resolve(captchaObj);
        });
        captchaObj.onError(() => {
          reject();
        });
      },
    );
  });

export const verifyCaptcha = (
  captchaObj: CaptchaObj,
): Promise<{ success: boolean; verifyParams: VerifyParams }> =>
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
    captchaObj.onError((e: Error) => {
      reject(e);
    });
    captchaObj.onClose((e: Error) => {
      captchaObj.reset();
      reject(e);
    });
  });
