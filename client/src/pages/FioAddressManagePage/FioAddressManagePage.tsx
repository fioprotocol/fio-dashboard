import React from 'react';
import ManagePageContainer, {
  DataProps,
  FetchDataFn,
  HasMore,
} from '../../components/ManagePageContainer/ManagePageContainer';

type Props = {
  children?: React.ReactNode;
  data: DataProps[];
  fetchDataFn: FetchDataFn;
  fioWallets: any;
  loading: boolean;
  hasMore: HasMore;
};

const FioAddressManagePage: React.FC<Props> = props => (
  <ManagePageContainer pageName="address" {...props} />
);

export default FioAddressManagePage;
