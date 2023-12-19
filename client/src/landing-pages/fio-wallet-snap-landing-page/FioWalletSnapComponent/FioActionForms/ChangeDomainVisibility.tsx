import React from 'react';
import { Form, Field } from 'react-final-form';

import TextInput, {
  INPUT_COLOR_SCHEMA,
  INPUT_UI_STYLES,
} from '../../../../components/Input/TextInput';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import CustomDropdown from '../../../../components/CustomDropdown';

type ErrorsProps = {
  fioDomain?: string;
  isPublic?: string;
};

const validateForm = ({
  fioDomain,
  isPublic,
}: {
  fioDomain: string;
  isPublic: string;
}): ErrorsProps => {
  const errors: ErrorsProps = {};

  if (!fioDomain) {
    errors.fioDomain = 'Required';
  }

  if (!isPublic) {
    errors.isPublic = 'Reqiured';
  }

  return errors;
};

type Props = {
  onSubmit: (values: any) => void;
};

export const ChangeDomainVisibility: React.FC<Props> = props => {
  const { onSubmit } = props;
  return (
    <div>
      <Form
        onSubmit={onSubmit}
        validate={validateForm}
        render={formProps => {
          const onChange = formProps.form.change;
          const handleDropdownChange = (value: string) => {
            onChange('isPublic', value);
          };
          return (
            <form onSubmit={formProps.handleSubmit}>
              <Field
                name="fioDomain"
                type="text"
                component={TextInput}
                placeholder="Type FIO Domain"
                label="FIO Domain"
                colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                errorColor={COLOR_TYPE.WARN}
              />

              <CustomDropdown
                options={[
                  { id: '1', name: 'Public' },
                  { id: '0', name: 'Private' },
                ]}
                onChange={handleDropdownChange}
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
