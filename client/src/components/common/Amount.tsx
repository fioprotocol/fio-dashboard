import React from 'react';

const Amount: React.FC<{ value?: number | string }> = ({ value, children }) => {
  return <>{Number(value || children || 0).toLocaleString('en-US')}</>;
};

export default Amount;
