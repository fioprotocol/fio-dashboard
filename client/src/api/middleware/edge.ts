import crypto from 'crypto';

import { EdgeContextRes } from '../edge';

export const handleEdgeKI = (
  data: EdgeContextRes,
): { decAIv: string; decAKv: string } => {
  const { buffer, edgeAI, edgeAK, iv } = data;

  const decAK = crypto.createDecipheriv(
    'aes-256-cbc',
    Uint8Array.from(buffer.data),
    Uint8Array.from(iv.data),
  );
  const decAI = crypto.createDecipheriv(
    'aes-256-cbc',
    Uint8Array.from(buffer.data),
    Uint8Array.from(iv.data),
  );

  let decAKv = decAK.update(edgeAK, 'hex', 'utf8');
  decAKv += decAK.final('utf8');

  let decAIv = decAI.update(edgeAI, 'hex', 'utf8');
  decAIv += decAI.final('utf8');

  return { decAIv, decAKv };
};
