import { makeServiceRunner } from '../tools';
import GeneralHealthCheck from '../services/general/HealthCheck';
import ImageToHash from '../services/general/ImageToHash.mjs';

export default {
  healthCheck: makeServiceRunner(GeneralHealthCheck),
  imageToHash: makeServiceRunner(ImageToHash, req => req.query),
};
