import { makeServiceRunner } from '../tools';

import RefProfileInfo from '../services/refProfile/Info';
import RefProfileSettings from '../services/refProfile/Settings';

export default {
  info: makeServiceRunner(RefProfileInfo, req => req.params),
  settings: makeServiceRunner(RefProfileSettings, req => req.params),
};
