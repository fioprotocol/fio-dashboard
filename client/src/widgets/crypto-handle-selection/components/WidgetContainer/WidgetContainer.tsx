import AddressWidget from '../../../../components/AddressWidget';
import Roe from '../../../../services/Roe';

const WidgetContainer = () => {
  return (
    <>
      <Roe />
      <AddressWidget
        links={{
          getCryptoHandle: process.env.REACT_APP_CH_WIDGET_SITE_URL,
        }}
      />
    </>
  );
};

export default WidgetContainer;
