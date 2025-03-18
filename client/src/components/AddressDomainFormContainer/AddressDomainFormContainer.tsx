import React from 'react';
import { Form, Field } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import debounce from 'lodash/debounce';

import TextInput, {
  INPUT_COLOR_SCHEMA,
  INPUT_UI_STYLES,
} from '../../components/Input/TextInput';

import { DEFAULT_DEBOUNCE_TIMEOUT } from '../../constants/timeout';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import useQuery from '../../hooks/useQuery';
import useEffectOnce from '../../hooks/general';
import { normalizeFioHandle } from '../../util/fio';

import classes from './AddressDomainFormContainer.module.scss';

type Props = {
  fieldName: string;
  loading: boolean;
  placeholder: string;
  queryParam: typeof QUERY_PARAMS_NAMES[keyof typeof QUERY_PARAMS_NAMES];
  setFieldValue: (address: string) => void;
};

export const AddressDomainFormContainer: React.FC<Props> = props => {
  const { fieldName, loading, placeholder, queryParam, setFieldValue } = props;

  const handleChange = (value: string) => {
    setFieldValue(value);
  };

  const debouncedHandleChange = debounce(
    handleChange,
    DEFAULT_DEBOUNCE_TIMEOUT,
  );

  const queryParams = useQuery();
  const initialValue = normalizeFioHandle(queryParams.get(queryParam));

  useEffectOnce(() => {
    if (initialValue) {
      handleChange(initialValue);
    }
  }, [initialValue]);

  return (
    <div className={classes.container}>
      <Form onSubmit={() => null} initialValues={{ [fieldName]: initialValue }}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field
              name={fieldName}
              type="text"
              placeholder={placeholder}
              colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
              component={TextInput}
              hideError="true"
              lowerCased
              loading={loading}
              uiType={INPUT_UI_STYLES.INDIGO_WHITE}
              withoutBottomMargin
            />
            <OnChange name={fieldName}>{debouncedHandleChange}</OnChange>
          </form>
        )}
      </Form>
    </div>
  );
};
