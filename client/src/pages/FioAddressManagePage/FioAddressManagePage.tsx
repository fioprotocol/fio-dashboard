import React, { useEffect } from 'react';
import { isEmpty } from 'lodash';
import ManagePageContainer, {
  DataProps,
} from '../../components/ManagePageContainer/ManagePageContainer';

type Props = {
  children?: React.ReactNode;
  data: DataProps[];
  getFioAddresses: (publicKey: string, limit: number, offset: 0) => void;
  fioWallets: any;
  loading: boolean;
};

const FioAddressManagePage: React.FC<Props> = props => {
  const { data, getFioAddresses, fioWallets, loading } = props;

  useEffect(() => {
    if (!isEmpty(fioWallets)) {
      for (const fioWallet of fioWallets) {
        getFioAddresses(fioWallet.publicKey, 25, 0);
      }
    }
  }, [fioWallets]);
  return (
    <ManagePageContainer pageName="address" data={data} loading={loading} />
  );
};

export default FioAddressManagePage;
