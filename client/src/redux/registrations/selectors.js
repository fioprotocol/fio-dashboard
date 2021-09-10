import { refProfileInfo } from '../refProfile/selectors';
import { prefix } from './actions';

export const loading = state => state[prefix].loading;
export const prices = state => state[prefix].prices;
export const domains = state => {
  let publicDomains = state[prefix].domains;
  const refProfile = refProfileInfo(state);
  if (refProfile != null && refProfile.code) {
    publicDomains = refProfile.settings.domains.map(refDomain => ({
      domain: refDomain,
      free: true,
    }));
  }
  return publicDomains;
};
export const captchaResult = state => state[prefix].captchaResult;
export const captchaResolving = state => state[prefix].captchaResolving;
export const registrationResult = state => state[prefix].registrationResult;
export const isProcessing = state => state[prefix].isProcessing;
export const allowCustomDomains = state => {
  const refProfile = refProfileInfo(state);
  if (refProfile != null && refProfile.code) {
    return !!refProfile.settings.allowCustomDomain;
  }
  return true;
};
