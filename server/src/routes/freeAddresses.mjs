import { makeServiceRunner } from '../tools';
import GetFreeAddress from '../services/freeAddresses/Get.mjs';

export default {
  getFreeAddresses: makeServiceRunner(GetFreeAddress, req => req.query),
};
