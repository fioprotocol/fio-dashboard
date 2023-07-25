import React from 'react';

import { Link } from 'react-router-dom';

import Title from '../../../WalletsPage/components/Title';
import ActionButtonsContainer from '../../../WalletsPage/components/ActionButtonsContainer';

import { ROUTES } from '../../../../constants/routes';

import unwrapIcon from '../../../../assets/images/unwrap.svg';

import classes from './TitleComponent.module.scss';

export const TitleComponent: React.FC = props => {
  return (
    <Title title="Manage My FIO Domain">
      <ActionButtonsContainer>
        <Link to={ROUTES.UNWRAP_DOMAIN} className={classes.link}>
          <div>
            <img src={unwrapIcon} alt="unwrap" />
          </div>
        </Link>
      </ActionButtonsContainer>
    </Title>
  );
};
