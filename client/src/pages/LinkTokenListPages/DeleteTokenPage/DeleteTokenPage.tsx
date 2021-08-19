import React from 'react';
import { RouteComponentProps } from 'react-router';
import DeleteToken from '../../../components/LinkTokenList/DeleteToken';

const DeleteTokenPage: React.FC<RouteComponentProps> = props => {
  return <DeleteToken {...props} />;
};

export default DeleteTokenPage;
