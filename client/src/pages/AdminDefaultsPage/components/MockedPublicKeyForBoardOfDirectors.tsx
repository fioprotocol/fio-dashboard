import React from 'react';
import { Field } from 'react-final-form';

import Input, { INPUT_UI_STYLES } from '../../../components/Input/Input';

import classes from '../styles/AdminDefaultsPage.module.scss';

export const MockedPublicKeyForBoardOfDirectors: React.FC = () => {
  return (
    <div className={classes.section}>
      <div className={classes.sectionHeader}>
        <h3>Mocked FIO Public Key</h3>
      </div>
      <p>Mocked FIO Public Key for testing Vote of directors.</p>
      <Field
        component={Input}
        uiType={INPUT_UI_STYLES.BLACK_WHITE_WITH_BORDER}
        className="mr-3"
        name="mockedPublicKey"
        type="text"
        placeholder="Enter FIO Public Key"
      />
    </div>
  );
};
