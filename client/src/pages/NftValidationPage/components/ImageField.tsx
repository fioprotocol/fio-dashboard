import React from 'react';
import { Field, useForm } from 'react-final-form';

import Input from '../../../components/Input/Input';
import { TITLE_NAME } from '../constant';
import { getHash } from '../../../util/general';

import classes from '../styles/ImageField.module.scss';

const ImageField: React.FC = () => {
  const form = useForm();

  const onChange = async (file: File, imageUrl: string) => {
    form.change(TITLE_NAME.imageUrl.id, imageUrl);
    form.change(TITLE_NAME.imageName.id, file.name);
    const hash = await getHash(file);
    form.change(TITLE_NAME.hash.id, hash);
  };

  return (
    <div className={classes.container}>
      <Field
        component={Input}
        type="file"
        name={TITLE_NAME.image.id}
        customChange={onChange}
        accept="image/*"
      />
      <Field component={Input} type="hidden" name={TITLE_NAME.imageUrl.id} />
      <Field component={Input} type="hidden" name={TITLE_NAME.hash.id} />
      <Field component={Input} type="hidden" name={TITLE_NAME.imageName.id} />
    </div>
  );
};

export default ImageField;
