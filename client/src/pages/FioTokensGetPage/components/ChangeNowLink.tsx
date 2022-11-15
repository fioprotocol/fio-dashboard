import React from 'react';
import classnames from 'classnames';

import changeNOWSquareLogoSrc from '../../../assets/images/change-now-logo-square.svg';
import changeNOWLogoSrc from '../../../assets/images/change-now-logo.svg';

import classes from '../FioTokensGetPage.module.scss';

export const ChangeNowLink: React.FC = () => {
  return (
    <a
      href="https://changenow.io?link_id=90905fc19e7f9b&to=fio"
      target="_blank"
      rel="noreferrer"
      className={classnames(classes.link, classes.linkChangeNOW)}
    >
      <img src={changeNOWSquareLogoSrc} alt="ChangeNOW" />
      <img src={changeNOWLogoSrc} alt="ChangeNOW" />
    </a>
  );
};
