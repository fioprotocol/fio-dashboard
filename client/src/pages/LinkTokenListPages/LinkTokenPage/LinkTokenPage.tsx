import React from 'react';
import { RouteComponentProps } from 'react-router';
import LinkToken from '../../../components/LinkTokenList/LinkToken';

const LinkTokenPage: React.FC<RouteComponentProps> = props => {
  return <LinkToken {...props} />;
};

export default LinkTokenPage;
