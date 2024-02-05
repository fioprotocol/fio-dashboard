import React from 'react';

import metamaskAtLogoSrc from '../../assets/images/metamask-landing/metamask-at.svg';

import classes from './MetamaskgatedRegistration.module.scss';

type UseContext = {
  addressWidgetContent: {
    classNameContainer: string;
    classNameForm: string;
    classNameLogo: string;
    classNameLogoContainer: string;
    logoSrc: string;
    subtitle: string;
    title: React.ReactNode;
  };
};

const TitleComponent = () => (
  <div className={classes.title}>Get Your Free @metamask Handle</div>
);

export const useContext = (): UseContext => {
  const addressWidgetContent = {
    classNameContainer: classes.container,
    classNameForm: classes.form,
    classNameLogo: classes.logo,
    classNameLogoContainer: classes.logoContainer,
    logoSrc: metamaskAtLogoSrc,
    subtitle: 'and make your cryptocurrency payments easy',
    suffixText: '@metamask',
    title: <TitleComponent />,
  };
  return { addressWidgetContent };
};
