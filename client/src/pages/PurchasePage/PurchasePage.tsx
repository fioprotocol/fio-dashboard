import React from 'react';

import { OrderDetailsContainer } from '../../components/OrderDetailsContainer';
import { ContextProps } from '../../components/OrderDetailsContainer/OrderDetailsContainerContext';

import { OrderDetails } from '../OrderDetailsPage/OrderDetailsPage';
import Processing from '../../components/common/TransactionProcessing';

import { useContext } from './PurchasePageContext';

const PurchaseComponent: React.FC<ContextProps> = props => {
  const {
    actionClick,
    buttonText,
    disabledButton,
    hideTopCloseButton,
    isProcessing,
  } = useContext(props);

  return (
    <>
      <OrderDetails
        buttonText={buttonText}
        actionClick={actionClick}
        disabled={disabledButton}
        hideTopCloseButton={hideTopCloseButton}
        {...props}
      />
      <Processing isProcessing={isProcessing} />
    </>
  );
};

const PurchasePage = (): React.ReactElement => (
  <OrderDetailsContainer>
    {(containerProps: ContextProps) => (
      <PurchaseComponent {...containerProps} />
    )}
  </OrderDetailsContainer>
);

export default PurchasePage;
