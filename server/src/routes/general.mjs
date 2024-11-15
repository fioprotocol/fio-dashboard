import { makeServiceRunner } from '../tools';
import GeneralHealthCheck from '../services/general/HealthCheck';
// TODO: commented due to DASH-711 task. We hide it until figure out with hash
// import ImageToHash from '../services/general/ImageToHash.mjs';
import GetUrlContent from '../services/general/GetUrlContent.mjs';
import GetSiteSettings from '../services/general/GetSiteSettings.mjs';

export default {
  getUrlContent: makeServiceRunner(GetUrlContent, req => req.query),
  healthCheck: makeServiceRunner(GeneralHealthCheck),
  getSiteSettings: makeServiceRunner(GetSiteSettings),
  // TODO: commented due to DASH-711 task. We hide it until figure out with hash
  // imageToHash: makeServiceRunner(ImageToHash, req => req.query),
};
