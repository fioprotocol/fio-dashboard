import { makeServiceRunner } from '../tools';
import GeneralHealthCheck from '../services/general/HealthCheck';

export default {
  healthCheck: makeServiceRunner(GeneralHealthCheck),
};
