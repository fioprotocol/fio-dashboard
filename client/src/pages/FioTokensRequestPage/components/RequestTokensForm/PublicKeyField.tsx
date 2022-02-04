import React, { useEffect } from 'react';
import { Field, useForm, useFormState } from 'react-final-form';

import TextInput, {
  INPUT_UI_STYLES,
} from '../../../../components/Input/TextInput';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';

import { RequestTokensValues } from '../../types';
import { MappedPublicAddresses } from '../../../../types';

type Props = {
  loading: boolean;
  pubAddressesMap: MappedPublicAddresses;
};

const PUB_ADDRESS_FIELD_NAME = 'payeeTokenPublicAddress';

const PublicKeyField: React.FC<Props> = props => {
  const { loading, pubAddressesMap } = props;

  const { change } = useForm();
  const { values }: { values: RequestTokensValues } = useFormState();

  const { chainCode, tokenCode, payeeFioAddress } = values;

  const handleFieldsChange = () => {
    const pubAddressItem = pubAddressesMap[
      payeeFioAddress
    ].publicAddresses.find(
      ({ chainCode: cCode, tokenCode: tCode }) =>
        chainCode === cCode && tokenCode === tCode,
    );

    if (pubAddressItem != null)
      change(PUB_ADDRESS_FIELD_NAME, pubAddressItem.publicAddress);
  };

  useEffect(() => {
    if (
      chainCode != null &&
      tokenCode != null &&
      payeeFioAddress != null &&
      pubAddressesMap != null &&
      pubAddressesMap[payeeFioAddress] != null &&
      pubAddressesMap[payeeFioAddress].publicAddresses != null
    ) {
      handleFieldsChange();
    }
  }, [chainCode, tokenCode, payeeFioAddress, pubAddressesMap]);

  return (
    <Field
      name={PUB_ADDRESS_FIELD_NAME}
      type="text"
      placeholder="Enter or Paste Token Address"
      uiType={INPUT_UI_STYLES.BLACK_WHITE}
      errorColor={COLOR_TYPE.WARN}
      component={TextInput}
      disabled={loading}
      showPasteButton={true}
      label="Public Address (where funds will be sent)"
    />
  );
};

export default PublicKeyField;
