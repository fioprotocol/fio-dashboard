import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import classes from '../MainHeader.module.scss';
import { RefProfile } from '../../../types';

type SiteLinkProps = {
  hideSiteLink?: boolean;
  refProfileInfo?: RefProfile;
};

const SiteLink: React.FC<SiteLinkProps> = props => {
  const { hideSiteLink, refProfileInfo } = props;

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
