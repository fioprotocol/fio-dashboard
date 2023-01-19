import React from 'react';
import { Form, Field } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import debounce from 'lodash/debounce';

import TextInput, {
  INPUT_COLOR_SCHEMA,
} from '../../../components/Input/TextInput';
import { AddressDomainFormContainer } from '../../../components/AddressDomainFormContainer';

import { DEFAULT_DEBOUNCE_TIMEOUT } from '../../../constants/timeout';
import { QUERY_PARAMS_NAMES } from '../../../constants/queryParams';

import useQuery from '../../../hooks/useQuery';
import useEffectOnce from '../../../hooks/general';

type Props = {
  loading: boolean;
  setAddressValue: (address: string) => void;
};

const FIELD_NAME = 'address';

export const AddressFormContainer: React.FC<Props> = props => {
  const { loading, setAddressValue } = props;

  const handleChange = (value: string) => {
    setAddressValue(value);
  };

  const debouncedHandleChange = debounce(
    handleChange,
    DEFAULT_DEBOUNCE_TIMEOUT,
  );

  const queryParams = useQuery();
  const address = queryParams.get(QUERY_PARAMS_NAMES.ADDRESS);

  useEffectOnce(() => {
    if (address) {
      handleChange(address);
    }
  }, [address]);

  return (
    <AddressDomainFormContainer>
      <Form onSubmit={() => null} initialValues={{ address }}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field
              name={FIELD_NAME}
              type="text"
              placeholder="Enter a Username"
              colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
              component={TextInput}
              hideError="true"
              lowerCased
              loading={loading}
              withoutBottomMargin
            />
            <OnChange name={FIELD_NAME}>{debouncedHandleChange}</OnChange>
          </form>
        )}
      </Form>
    </AddressDomainFormContainer>
  );
};
