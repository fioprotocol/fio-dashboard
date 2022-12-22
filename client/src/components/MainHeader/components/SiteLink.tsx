import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import { REF_PROFILE_TYPE } from '../../../constants/common';

import { RefProfile } from '../../../types';

import classes from '../MainHeader.module.scss';

type SiteLinkProps = {
  hideSiteLink?: boolean;
  refProfileInfo?: RefProfile;
};

const SiteLink: React.FC<SiteLinkProps> = props => {
  const { hideSiteLink, refProfileInfo } = props;

  if (refProfileInfo?.type === REF_PROFILE_TYPE.AFFILIATE) {
    return <div className={classes.link} />;
  }

  let link = 'https://fioprotocol.io/';
  let text = 'Go to fioprotocol.io';
  let target = '_blank';

  if (refProfileInfo != null && refProfileInfo.code) {
    link = refProfileInfo.settings.link;
    text = `Return to ${refProfileInfo.label}`;
    target = '_self';
  }

  if (hideSiteLink) return null;

  return (
    <div className={classnames(classes.link, classes.siteLink)}>
      <a
        href={link}
        target={target}
        rel="noopener noreferrer"
        className="text-white"
      >
        <FontAwesomeIcon
          icon="arrow-left"
          className={classnames(classes.arrow, 'mr-2', 'text-white')}
        />
        {text}
      </a>
    </div>
  );
};

export default SiteLink;
