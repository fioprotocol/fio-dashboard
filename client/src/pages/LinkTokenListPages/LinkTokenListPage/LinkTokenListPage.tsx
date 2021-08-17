import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import ListToken from '../../../components/LinkTokenList/ListToken';

const LinkTokenListPage: React.FC<RouteComponentProps> = props => {
  return <ListToken {...props} />;
};

export default LinkTokenListPage;
