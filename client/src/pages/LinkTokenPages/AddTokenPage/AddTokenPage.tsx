import React from 'react';
import { RouteComponentProps } from 'react-router';
import AddToken from '../../../components/LinkTokenList/AddToken';

const AddTokenPage: React.FC<RouteComponentProps> = props => {
  return <AddToken {...props} />;
};

export default AddTokenPage;
