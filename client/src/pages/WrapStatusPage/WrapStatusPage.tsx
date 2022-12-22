import React from 'react';
import { Redirect } from 'react-router-dom';

import { ROUTES } from '../../constants/routes';

const WrapStatusPage: React.FC = () => {
  return <Redirect to={ROUTES.WRAP_STATUS_WRAP_TOKENS} />;
};

export default WrapStatusPage;
