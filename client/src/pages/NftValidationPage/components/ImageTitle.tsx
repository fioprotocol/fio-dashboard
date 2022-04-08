import React from 'react';

import GenericTitleComponent from './GenericTitleComponent';
import { TITLE_NAME } from '../constant';

import classes from '../styles/ImageTitle.module.scss';

type Props = {
  imageUrl?: string;
  imageName?: string;
};

const ImageTitle: React.FC<Props> = props => {
  const { imageUrl, imageName } = props;

  return (
    <>
      <div>
        <img src={imageUrl} alt="hashedImage" className={classes.image} />
      </div>
      <GenericTitleComponent title={TITLE_NAME.image.name} value={imageName} />
    </>
  );
};

export default ImageTitle;
