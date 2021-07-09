import React from 'react';
import ManagePageContainer, {
  DataProps,
} from '../../components/ManagePageContainer/ManagePageContainer';

type Props = {
  children?: React.ReactNode;
  data: DataProps[];
};

const FioAddressManagePage: React.FC<Props> = props => {
  const { data } = props;
  return <ManagePageContainer pageName="address" data={data} />;
};

export default FioAddressManagePage;
