import React from 'react';

import LayoutContainer from '../../components/LayoutContainer/LayoutContainer';
import Loader from '../../components/Loader/Loader';

import { useContext } from './AdminRegularUserDetailsPageContext';
import { FioCryptoHandlesTable } from './components/FioCryptoHandlesTable';
import { FioDomainsTable } from './components/FioDomainsTable';
import { UserInfo } from './components/UserInfo';
import { UserOrders } from './components/UserOrders';
import { WalletsTable } from './components/WalletsTable';
import AdminOrderModal from '../AdminOrdersPage/components/AdminOrderModal/AdminOrderModal';

const AdminRegularUserDetailsPage: React.FC = () => {
  const {
    affiliateProfile,
    createdAt,
    id,
    email,
    fioDomains,
    fioWallets,
    fioAddresses,
    loading,
    orders,
    refProfile,
    status,
    timeZone,
    handleOrderClick,
    handleOrderClose,
    orderInfo,
  } = useContext();

  if (loading) return <Loader />;

  return (
    <LayoutContainer title={email || id}>
      <UserInfo
        affiliateProfile={affiliateProfile}
        createdAt={createdAt}
        refProfile={refProfile}
        status={status}
        timeZone={timeZone}
      />
      <WalletsTable fioWallets={fioWallets} />
      <FioDomainsTable fioDomains={fioDomains} />
      <FioCryptoHandlesTable fioAddresses={fioAddresses} />
      <UserOrders orders={orders} handleOrderClick={handleOrderClick} />
      <AdminOrderModal
        isVisible={!!orderInfo}
        onClose={handleOrderClose}
        orderItem={orderInfo}
      />
    </LayoutContainer>
  );
};

export default AdminRegularUserDetailsPage;
