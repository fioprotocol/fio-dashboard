import React, { ReactNode } from 'react';

import classnames from 'classnames';

import classes from '../AddressWidget.module.scss';

type Props = {
  classNameLogo?: string;
  classNameLogoContainer?: string;
  classNameTitle?: string;
  logoSrc: string | null;
  title: string | ReactNode | null;
};

export const ContainedFlowSignNftTitle: React.FC = () => {
  return <h1 className={classes.title}>Hi! Let's Sign Your NFT</h1>;
};

export const ContainedFlowRegTitle: React.FC = () => {
  return <h1 className={classes.title}>Get your decentralized FIO Handle</h1>;
};

const TitleComponent: React.FC<Props> = props => {
  const {
    classNameLogo,
    classNameLogoContainer,
    classNameTitle,
    logoSrc,
    title,
  } = props;

  const renderLogo = () => {
    return logoSrc ? (
      <div className={classnames('mb-5', classNameLogoContainer)}>
        <img
          src={logoSrc}
          className={classnames(classes.logoImg, classNameLogo)}
          alt=""
        />
      </div>
    ) : null;
  };
  const renderTitle = () => {
    return title ? (
      typeof title === 'string' ? (
        <h1 className={classnames(classes.title, classNameTitle)}>{title}</h1>
      ) : (
        <>{title}</>
      )
    ) : (
      <ContainedFlowRegTitle />
    );
  };

  return (
    <>
      {renderLogo()}
      {renderTitle()}
    </>
  );
};

export default TitleComponent;
