import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { FioNameItemProps } from '../../../types';

import ListToken from '../../../components/LinkTokenList/ListToken';

type Props = {
  currentFioAddress: FioNameItemProps;
};

const LinkTokenListPage: React.FC<Props & RouteComponentProps> = props => {
  return <ListToken {...props} />;
};

export default LinkTokenListPage;
