import React from 'react';
import ManagePageContainer, {
  DataProps,
} from '../../components/ManagePageContainer/ManagePageContainer';

type Props = {
  children?: React.ReactNode;
  data: DataProps[];
};

const FioDomainManagePage: React.FC<Props> = props => {
  const { data } = props;
  return <ManagePageContainer pageName="domain" data={data} />;
};

export default FioDomainManagePage;
