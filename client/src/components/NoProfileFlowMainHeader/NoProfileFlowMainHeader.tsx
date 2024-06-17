import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Nav } from 'react-bootstrap';
import classnames from 'classnames';

import ListAltIcon from '@mui/icons-material/ListAlt';

import { MainHeaderContainer } from '../MainHeaderContainer';
import { useContext, NavItemParam } from './NoProfileFlowMainHeaderContext';
import { SideMenu } from '../MainHeader/components/SideMenu/SideMenu';

import { ROUTES } from '../../constants/routes';
import { REF_PROFILE_SLUG_NAME } from '../../constants/ref';

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

const NavItemContent: React.FC<{
  icon?: React.ReactElement;
  title: string;
}> = ({ icon, title }) => (
  <div className={classes.headerItemContainer}>
    {icon && <div className={classes.icon}>{icon}</div>}
    {title}
  </div>
);

const DesktopNavItem: React.FC<{
  icon?: React.ReactElement;
  isActive: boolean;
  title: string;
}> = ({ icon, isActive, title }) => (
  <Button
    className={classnames(classes.button, isActive && classes.isActive)}
    size="lg"
  >
    <NavItemContent icon={icon} title={title} />
  </Button>
);

const NavComponent: React.FC<NavItemParam> = ({
  activeEventKey,
  isDesktop,
  refProfileCode,
  queryParams,
  handleEventKeySelect,
}) => (
  <Nav className={!isDesktop && classes.mobileNav}>
    {MAIN_HEADER_ITEMS.map((mainHeaderItem, i) => {
      const eventKeyPathname = mainHeaderItem.link.replace(
        REF_PROFILE_SLUG_NAME,
        refProfileCode,
      );

      const isActive = eventKeyPathname === activeEventKey;

      return (
        <Nav.Link
          as={Link}
          to={{
            pathname: eventKeyPathname,
            search: queryParams ? queryParams : null,
          }}
          onSelect={handleEventKeySelect}
          eventKey={eventKeyPathname}
          className={classnames(
            isDesktop ? classes.link : classes.mobileLink,
            isActive && classes.isActive,
          )}
          key={mainHeaderItem.title}
        >
          {isDesktop ? (
            <DesktopNavItem
              icon={mainHeaderItem.icon}
              isActive={isActive}
              title={mainHeaderItem.title}
            />
          ) : (
            <NavItemContent
              icon={mainHeaderItem.icon}
              title={mainHeaderItem.title}
            />
          )}
        </Nav.Link>
      );
    })}
  </Nav>
);

export const NoProfileFlowMainHeader: React.FC = () => {
  const {
    isDesktop,
    isMenuOpen,
    navParams,
    refProfile,
    queryParamsToSet,
    toggleMenuOpen,
  } = useContext();

  return (
    <MainHeaderContainer
      hideSiteLink
      noBoxShadow
      refProfileInfo={refProfile}
      queryParams={queryParamsToSet}
    >
      <div className={classes.container}>
        {isDesktop ? (
          <NavComponent {...navParams} />
        ) : (
          <SideMenu isMenuOpen={isMenuOpen} toggleMenuOpen={toggleMenuOpen}>
            <NavComponent {...navParams} />
          </SideMenu>
        )}
      </div>
    </MainHeaderContainer>
  );
};
