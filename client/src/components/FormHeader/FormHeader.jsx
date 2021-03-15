import React from 'react';
import classnames from 'classnames';
import classes from './FormHeader.module.scss';

const FormHeader = props => {
  const { title, subtitle, isDoubleColor } = props;
  
  const firstWord = isDoubleColor && typeof title === 'string' && title.split(' ')[0] || '';
  return (
    <div className={classnames(!subtitle && 'mb-4','d-flex flex-column text-white align-items-center justify-center')}>
      <h4
        className={classnames(isDoubleColor && classes.colored, classes.baseColored)}
        data-highlightword={isDoubleColor && firstWord}
      >
        {title}
      </h4>
      {subtitle && <div className='text-center mb-4'>{subtitle}</div>}
    </div>
  );
};

export default FormHeader;