import React, { useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import ManagePageContainer, {
  DataProps,
} from '../../components/ManagePageContainer/ManagePageContainer';

type Props = {
  children?: React.ReactNode;
  data: DataProps[];
  getFioDomains: (publicKey: string, limit: number, offset: 0) => void;
  fioWallets: any;
  loading: boolean;
};

const FioDomainManagePage: React.FC<Props> = props => {
  const { data, getFioDomains, fioWallets, loading } = props;

  useEffect(() => {
    if (!isEmpty(fioWallets)) {
      for (const fioWallet of fioWallets) {
        getFioDomains(fioWallet.publicKey, 25, 0);
      }
    }
  }, [fioWallets]);

  return (
    <ManagePageContainer pageName="domain" data={data} loading={loading} />
  );
};

export default FioDomainManagePage;
