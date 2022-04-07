import React from 'react';

import ImageTitle from './ImageTitle';
import { TITLE_NAME } from '../constant';
import { RenderTitle } from './types';
import classes from '../styles/GenericTitleComponent.module.scss';

type Props = {
  title: string;
  value?: string;
};

const GenericTitleComponent: React.FC<Props> = props => {
  const { title, value } = props;
  return (
    <div className={classes.container}>
      <h5 className={classes.title}>{title}:</h5>
      <p className={classes.value}>{value || '-'}</p>
    </div>
  );
};

export default GenericTitleComponent;

export const renderFioAddressTitle: RenderTitle = searchParams => (
  <GenericTitleComponent
    title={TITLE_NAME.fioAddress.name}
    value={searchParams[TITLE_NAME.fioAddress.id]}
  />
);

export const renderHashTitle: RenderTitle = values => (
  <GenericTitleComponent title={TITLE_NAME.hash.name} value={values.hash} />
);

export const renderImageTitle: RenderTitle = values => {
  const { imageUrl, imageName } = values;
  return <ImageTitle imageName={imageName} imageUrl={imageUrl} />;
};
