import { prefix } from './actions';

export const loading = state => state[prefix].loading;
export const prices = state => state[prefix].prices;
export const domains = state => state[prefix].domains;
export const captchaResult = state => state[prefix].captchaResult;
