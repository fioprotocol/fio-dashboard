import { makeServiceRunner } from '../tools';
import GeneralHealthCheck from '../services/general/HealthCheck';
import ImageToHash from '../services/general/ImageToHash.mjs';
import GetUrlContent from '../services/general/GetUrlContent.mjs';

export default {
  getUrlContent: makeServiceRunner(GetUrlContent, req => req.query),
  healthCheck: makeServiceRunner(GeneralHealthCheck),
  imageToHash: makeServiceRunner(ImageToHash, req => req.query),
};
