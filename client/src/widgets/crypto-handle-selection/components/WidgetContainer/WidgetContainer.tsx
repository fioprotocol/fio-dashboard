import React from 'react';

import AddressWidget from '../../../../components/AddressWidget';
import Roe from '../../../../services/Roe';

const WidgetContainer = () => {
  return (
    <>
      <Roe />
      <AddressWidget
        links={{
          getCryptoHandle: 'https://google.com',
        }}
      />
    </>
  );
};

export default WidgetContainer;
