import React, { useState } from 'react';
import { Field, useForm } from 'react-final-form';

import Input from '../../../components/Input/Input';
import { TITLE_NAME } from '../constant';
import { getHash } from '../../../util/general';

import classes from './ImageField.module.scss';

const ImageField: React.FC = () => {
  const [previewUrl, setPreviewUrl] = useState('');
  const form = useForm();

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;
    form.change(TITLE_NAME.image.id, currentValue);

    const file = e.target.files[0];

    if (file) {
      const fileUrl = window.URL.createObjectURL(file);
      form.change(TITLE_NAME.imageUrl.id, fileUrl);
      form.change(TITLE_NAME.imageName.id, file.name);
      const hash = await getHash(file);
      form.change(TITLE_NAME.hash.id, hash);
      setPreviewUrl(fileUrl);
    }
  };

  return (
    <div className={classes.container}>
      <Field
        component={Input}
        type="file"
        name={TITLE_NAME.image.id}
        customChange={onChange}
        previewUrl={previewUrl}
      />
      <Field component={() => null} type="hide" name={TITLE_NAME.imageUrl.id} />
      <Field component={() => null} type="hide" name={TITLE_NAME.hash.id} />
      <Field
        component={() => null}
        type="hide"
        name={TITLE_NAME.imageName.id}
      />
    </div>
  );
};

export default ImageField;
