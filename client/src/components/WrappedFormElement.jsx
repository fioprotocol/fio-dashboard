import React from 'react';

export default function(props) {
  return function wrapperFormElement(field) {
    const { content, element: Component, className, ...rest } = props;
    return (
      <div className={className}>
        {field.label && <label key={field.label}>{field.label}</label>}
        <Component {...field.input} {...rest}>
          {content}
        </Component>
      </div>
    );
  };
}
