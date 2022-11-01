import { makeServiceRunner } from '../tools';

import GeneratePdfFile from '../services/generate-pdf';

export default {
  create: makeServiceRunner(GeneratePdfFile, req => req.body),
};
