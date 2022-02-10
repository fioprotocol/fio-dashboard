import React, { useEffect } from 'react';
import { Field, useForm, useFormState } from 'react-final-form';

import { LabelSuffix } from '../../../../components/Input/StaticInputParts';
import Input from '../../../../components/Input/Input';
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
const MAP_ADDRESS_FIELD_NAME = 'mapPubAddress';

const pubAddressMapIsSet = ({
  chainCode,
  tokenCode,
  payeeFioAddress,
  pubAddressesMap,
}: {
  chainCode: string;
  tokenCode: string;
  payeeFioAddress: string;
  pubAddressesMap: MappedPublicAddresses;
}) =>
  chainCode != null &&
  tokenCode != null &&
  payeeFioAddress != null &&
  pubAddressesMap != null &&
  pubAddressesMap[payeeFioAddress] != null &&
  pubAddressesMap[payeeFioAddress].publicAddresses != null;

const PublicKeyField: React.FC<Props> = props => {
  const { loading, pubAddressesMap } = props;

  const { change } = useForm();
  const { values }: { values: RequestTokensValues } = useFormState();

  const {
    chainCode,
    tokenCode,
    payeeFioAddress,
    payeeTokenPublicAddress,
  } = values;

  const handleFieldsChange = () => {
    const pubAddressItem = pubAddressesMap[
      payeeFioAddress
    ].publicAddresses.find(
      ({ chainCode: cCode, tokenCode: tCode }) =>
        chainCode === cCode && tokenCode === tCode,
    );

    if (pubAddressItem != null) {
      change(PUB_ADDRESS_FIELD_NAME, pubAddressItem.publicAddress);
      change(MAP_ADDRESS_FIELD_NAME, false);
    }
  };

  useEffect(() => {
    if (
      pubAddressMapIsSet({
        chainCode,
        tokenCode,
        payeeFioAddress,
        pubAddressesMap,
      })
    ) {
      handleFieldsChange();
    }
  }, [chainCode, tokenCode, payeeFioAddress, pubAddressesMap]);

  const label = (
    <>
      Public Address{' '}
      <LabelSuffix
        text="(where funds will be sent)"
        uiType={INPUT_UI_STYLES.BLACK_WHITE}
      />
    </>
  );

  const renderMapCheckbox = () => {
    if (!payeeTokenPublicAddress) return null;
    if (
      !pubAddressMapIsSet({
        chainCode,
        tokenCode,
        payeeFioAddress,
        pubAddressesMap,
      })
    )
      return null;

    const pubAddressItem = pubAddressesMap[
      payeeFioAddress
    ].publicAddresses.find(
      ({ chainCode: cCode, tokenCode: tCode }) =>
        chainCode === cCode && tokenCode === tCode,
    );

    if (
      pubAddressItem != null &&
      pubAddressItem.publicAddress === payeeTokenPublicAddress
    )
      return null;

    let mapText = 'Map this ';
    if (
      pubAddressItem != null &&
      pubAddressItem.publicAddress !== payeeTokenPublicAddress
    )
      mapText = 'Override previous ';

    return (
      <div className="mt-n3 mb-3 pl-4 w-100">
        <Field
          name={MAP_ADDRESS_FIELD_NAME}
          type="checkbox"
          label={
            <>
              {mapText}address to <b>{payeeFioAddress}</b>
            </>
          }
          disabled={loading}
          uiType={INPUT_UI_STYLES.BLACK_LIGHT}
          hasThinText={true}
          component={Input}
        />
      </div>
    );
  };

  return (
    <>
      <Field
        name={PUB_ADDRESS_FIELD_NAME}
        type="text"
        placeholder="Enter or Paste Token Address"
        uiType={INPUT_UI_STYLES.BLACK_WHITE}
        errorColor={COLOR_TYPE.WARN}
        component={TextInput}
        disabled={loading}
        showPasteButton={true}
        label={label}
      />
      {renderMapCheckbox()}
    </>
  );
};

export default PublicKeyField;
