import React from 'react';
import { Field } from 'react-final-form';

import Input, { INPUT_UI_STYLES } from '../../../components/Input/Input';

import classes from '../styles/AdminDefaultsPage.module.scss';

export const VoteFioHandle: React.FC = () => {
  return (
    <div className={classes.section}>
      <div className={classes.sectionHeader}>
        <h3>Vote FIO Handle</h3>
      </div>
      <p>Used to vote for Board of Directors. Here will be sent FIO Request.</p>
      <Field
        component={Input}
        uiType={INPUT_UI_STYLES.BLACK_WHITE_WITH_BORDER}
        className="mr-3"
        name="voteFioHandle"
        type="text"
        placeholder="Enter Vote FIO Handle"
      />
    </div>
  );
};
