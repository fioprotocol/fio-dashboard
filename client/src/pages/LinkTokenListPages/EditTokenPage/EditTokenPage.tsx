import React from 'react';
import { RouteComponentProps } from 'react-router';
import EditToken from '../../../components/LinkTokenList/EditToken';

const EditTokenPage: React.FC<RouteComponentProps> = props => {
  return <EditToken {...props} />;
};

export default EditTokenPage;
