import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import { REF_PROFILE_TYPE } from '../../../../constants/common';

import { RefProfile } from '../../../../types';

import classes from './SiteLink.module.scss';

const DEFAULT_LINK = 'https://fioprotocol.io/';
const DEFAULT_LINK_TEXT = 'Go to fioprotocol.io';

type SiteLinkProps = {
  hideSiteLink?: boolean;
  refProfileInfo?: RefProfile;
};

export const SiteLink: React.FC<SiteLinkProps> = props => {
  const { hideSiteLink, refProfileInfo } = props;

  if (refProfileInfo?.type === REF_PROFILE_TYPE.AFFILIATE) {
    return <div className={classes.link} />;
  }

  let link = DEFAULT_LINK;
  let text = DEFAULT_LINK_TEXT;
  let target = '_blank';

  if (refProfileInfo != null && refProfileInfo.code) {
    link = refProfileInfo.settings.link;
    text = `Return to ${refProfileInfo.label}`;
    target = '_self';
  }

  if (hideSiteLink) return null;

  return (
    <div className={classnames(classes.link, classes.siteLink)}>
      <a href={link} target={target} rel="noopener noreferrer">
        <FontAwesomeIcon
          icon="arrow-left"
          className={classnames(classes.arrow, 'mr-2')}
        />
        {text}
      </a>
    </div>
  );
};
