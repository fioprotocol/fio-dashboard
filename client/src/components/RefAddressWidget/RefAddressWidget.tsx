import React from 'react';

import AddressWidget from '../AddressWidget';
import { VerificationLoader } from '../VerificationLoader';

import { useRefProfileAddressWidget } from '../../hooks/refProfile';

import { AddressWidgetProps } from '../AddressWidget/AddressWidget';
import { RefProfile } from '../../types';

import refClasses from '../../pages/RefHomePage/RefHomePage.module.scss';

type Props = {
  refProfileInfo?: RefProfile;
  addressWidgetContent?: AddressWidgetProps;
};

export const RefAddressWidget: React.FC<Props> = props => {
  const { refProfileInfo, addressWidgetContent } = props;

  const refProfileAddressWidget = useRefProfileAddressWidget({
    refProfileInfo,
  });

  const { verificationProps, ...rest } = refProfileAddressWidget;

  return (
    <AddressWidget
      {...addressWidgetContent}
      {...rest}
      inputClassNames={refClasses.input}
      dropdownClassNames={refClasses.dropdown}
      controlClassNames={refClasses.control}
      placeholderClassNames={refClasses.placeholder}
      menuClassNames={refClasses.menu}
      arrowCloseClassNames={refClasses.arrowClose}
      arrowOpenClassNames={refClasses.arrowOpen}
      optionItemClassNames={refClasses.optionItem}
      optionButtonClassNames={refClasses.optionButton}
      classNameContainer={refClasses.widgetContainer}
      inputCustomDomainClassNames={refClasses.customDomainInput}
      regInputCustomDomainClassNames={refClasses.customDomainRegInput}
    >
      <VerificationLoader {...verificationProps} />
    </AddressWidget>
  );
};
