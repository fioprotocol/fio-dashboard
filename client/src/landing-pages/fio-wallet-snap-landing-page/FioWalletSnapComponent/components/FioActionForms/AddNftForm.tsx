import React from 'react';
import { Form, Field } from 'react-final-form';

import TextInput, {
  INPUT_COLOR_SCHEMA,
  INPUT_UI_STYLES,
} from '../../../../../components/Input/TextInput';
import { COLOR_TYPE } from '../../../../../components/Input/ErrorBadge';
import SubmitButton from '../../../../../components/common/SubmitButton/SubmitButton';
import { NFT_CHAIN_CODE_LIST } from '../../../../../constants/common';
import CustomDropdown from '../../../../../components/CustomDropdown';
import { AnyType } from '../../../../../types';

type ErrorsProps = {
  fioHandle?: string;
  chainCode?: string;
  contractAddress?: string;
  tokenId?: string;
};

const validateForm = ({
  fioHandle,
  chainCode,
  contractAddress,
  tokenId,
}: {
  fioHandle: string;
  chainCode: string;
  contractAddress: string;
  tokenId: string;
}): ErrorsProps => {
  const errors: ErrorsProps = {};

  if (!fioHandle) {
    errors.fioHandle = 'Required';
  }

  if (!chainCode) {
    errors.chainCode = 'Required';
  }

  if (!tokenId) {
    errors.tokenId = 'Required';
  }

  if (!contractAddress) {
    errors.contractAddress = 'Required';
  }

  return errors;
};

type Props = {
  onSubmit: (values: AnyType) => void;
};

export const AddNftForm: React.FC<Props> = props => {
  const { onSubmit } = props;

  return (
    <div>
      <Form
        onSubmit={onSubmit}
        validate={validateForm}
        render={formProps => {
          const onChange = formProps.form.change;
          const handleDropdownChange = (value: string) => {
            onChange('chainCode', value);
          };
          return (
            <form onSubmit={formProps.handleSubmit}>
              <Field
                name="fioHandle"
                type="text"
                component={TextInput}
                placeholder="Type FIO Handle"
                label="FIO Handle"
                colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                errorColor={COLOR_TYPE.WARN}
              />

              <CustomDropdown
                options={NFT_CHAIN_CODE_LIST}
                onChange={handleDropdownChange}
              />

              <Field
                name="tokenId"
                type="text"
                placeholder="Enter token ID"
                label="Token ID"
                colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                errorColor={COLOR_TYPE.WARN}
                component={TextInput}
              />

              <Field
                name="contractAddress"
                type="text"
                placeholder="Enter or paste contract address"
                label="Contract Address"
                colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                errorColor={COLOR_TYPE.WARN}
                component={TextInput}
                showPasteButton
              />

              <Field
                name="url"
                type="text"
                placeholder="Enter or paste url"
                label="URL"
                colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                errorColor={COLOR_TYPE.WARN}
                component={TextInput}
                showPasteButton
              />

              <Field
                name="hash"
                type="text"
                placeholder="Enter or paste hash"
                label="Hash"
                colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                errorColor={COLOR_TYPE.WARN}
                component={TextInput}
                showPasteButton
              />

              <Field
                name="creatorUrl"
                type="text"
                component={TextInput}
                placeholder="Enter or paste creator url"
                label="Creator URL"
                colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                errorColor={COLOR_TYPE.WARN}
                showPasteButton
              />

              <SubmitButton
                text="Confirm params"
                hasLowHeight
                hasSmallText
                hasAutoWidth
                isCobalt
                disabled={!formProps.valid}
              />
            </form>
          );
        }}
      />
    </div>
  );
};
