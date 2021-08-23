import React from 'react';
import { RouteComponentProps } from 'react-router';
import TokenList from '../../../components/LinkTokenList/TokenList';

const TokenListPage: React.FC<RouteComponentProps> = props => {
  return <TokenList {...props} />;
};

export default TokenListPage;
