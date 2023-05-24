import React from 'react';

import Amount from '../common/Amount';

type Props = {
  costFio: string;
  costUsdc: string;
  isFree?: boolean;
};

export const PriceComponent: React.FC<Props> = props => {
  const { costFio, costUsdc, isFree } = props;

  if (isFree) return <span className="boldText">FREE</span>;

  return (
    <div>
      <span className="boldText">
        $<Amount value={costUsdc} />
      </span>{' '}
      (<Amount value={costFio} /> FIO)
    </div>
  );
};
