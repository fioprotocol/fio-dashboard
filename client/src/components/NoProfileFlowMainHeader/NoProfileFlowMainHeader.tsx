import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button, Nav } from 'react-bootstrap';
import classnames from 'classnames';

import ListAltIcon from '@mui/icons-material/ListAlt';

import { MainHeaderContainer } from '../MainHeaderContainer';
import { useContext } from './NoProfileFlowMainHeaderContext';

import { ROUTES } from '../../constants/routes';
import { REF_PROFILE_SLUG_NAME } from '../../constants/ref';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import classes from './NoProfeilFlowMainHeader.module.scss';

const MAIN_HEADER_ITEMS = [
  {
    title: 'Register FIO Handle',
    link: ROUTES.NO_PROFILE_REGISTER_FIO_HANDLE,
  },
  {
    title: 'Register FIO Domain',
    link: ROUTES.NO_PROFILE_REGISTER_FIO_DOMAIN,
  },
  {
    title: 'Add Bundles to Existing Handle',
    link: ROUTES.NO_PROFILE_ADD_BUNDLES,
  },
  {
    title: 'Renew Existing Domain',
    link: ROUTES.NO_PROFILE_RENEW_DOMAIN,
  },
  { title: 'Orders', link: ROUTES.ORDERS, icon: <ListAltIcon /> },
];

export const NoProfileFlowMainHeader: React.FC = () => {
  const {
    activeEventKey,
    publicKeyQueryParam,
    refProfile,
    setActiveEventKey,
  } = useContext();

  const handleSelect = useCallback(
    eventKey => {
      setActiveEventKey(eventKey);
    },
    [setActiveEventKey],
  );

  return (
    <MainHeaderContainer hideSiteLink noBoxShadow refProfileInfo={refProfile}>
      <div className={classes.container}>
        <Nav>
          {MAIN_HEADER_ITEMS.map((mainHeaderItem, i) => {
            const searchParam = publicKeyQueryParam
              ? `?${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${publicKeyQueryParam}`
              : '';
            const pathname = mainHeaderItem.link.replace(
              REF_PROFILE_SLUG_NAME,
              refProfile?.code,
            );
            const isActive = i.toString() === activeEventKey.toString();

            return (
              <Nav.Link
                as={Link}
                to={{ pathname, search: searchParam }}
                onSelect={handleSelect}
                eventKey={i}
                className="pr-0"
                key={mainHeaderItem.title}
              >
                <Button
                  className={classnames(
                    classes.button,
                    isActive && classes.isActive,
                  )}
                  size="lg"
                >
                  <div className={classes.headerItemContainer}>
                    {mainHeaderItem.icon && (
                      <div className={classes.icon}>{mainHeaderItem.icon}</div>
                    )}
                    {mainHeaderItem.title}
                  </div>
                </Button>
              </Nav.Link>
            );
          })}
        </Nav>
      </div>
    </MainHeaderContainer>
  );
};
