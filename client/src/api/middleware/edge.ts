import crypto from 'crypto';

import { EdgeContextRes } from '../edge';

export const handleEdgeKI = (data: EdgeContextRes) => {
  const { buffer, edgeAI, edgeAK, iv } = data;

  const decAK = crypto.createDecipheriv('aes-256-cbc', buffer.data, iv.data);
  const decAI = crypto.createDecipheriv('aes-256-cbc', buffer.data, iv.data);

  let decAKv = decAK.update(edgeAK, 'hex', 'utf8');
  decAKv += decAK.final('utf8');

  let decAIv = decAI.update(edgeAI, 'hex', 'utf8');
  decAIv += decAI.final('utf8');

  return { decAIv, decAKv };
};
