import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Redirect } from 'react-router-dom';

import PseudoModalContainer from '../../PseudoModalContainer';
import NotificationBadge from '../../NotificationBadge';
import { BADGE_TYPES } from '../../Badge/Badge';
import { ROUTES } from '../../../constants/routes';
import FioName from '../../common/FioName/FioName';
import TokenBadge from '../../Badges/TokenBadge/TokenBadge';
import TokenBadgeMobile from '../../Badges/TokenBadge/TokenBadgeMobile';

import { useCheckIfDesktop } from '../../../screenType';
import { FioNameItemProps } from '../../../types';

import classes from './TokenList.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const INFO_MESSAGE = (
  <>
    <p className="mt-2">
      When you link your FIO Address to a public address for a specific token
      type, you allow others to easily send you that token to your FIO Address
      without worrying about public addresses.
    </p>
    <p>
      By default your FIO Address is not linked to any public address and can
      only be used to send and receive FIO Requests. You can change the mapping
      at any time. Just remember, once you link it anyone can see your public
      address if they know your FIO Address.
    </p>
  </>
);

type Props = { currentFioAddress: FioNameItemProps };

const ListToken: React.FC<Props & RouteComponentProps> = props => {
  const [showBadge, toggleShowBadge] = useState(true); // todo: display if only FIO linked
  const onClose = () => toggleShowBadge(false);

  const {
    currentFioAddress: { name, publicAddresses },
    match: { url },
  } = props;

  const isDesktop = useCheckIfDesktop();

  if (!name) return <Redirect to={{ pathname: ROUTES.FIO_ADDRESSES }} />;

  return (
    <PseudoModalContainer
      title="FIO Address Linking"
      link={ROUTES.FIO_ADDRESSES}
      hasAutoWidth={true}
    >
      <div className={classes.container}>
        <NotificationBadge
          message={INFO_MESSAGE}
          noDash={true}
          onClose={onClose}
          show={showBadge}
          title="What is Wallet Linking?"
          type={BADGE_TYPES.INFO}
        />
        <div className={classes.actionContainer}>
          <FioName name={name} />
          <div className={classes.buttonsContainer}>
            <Link to={`${url}${ROUTES.EDIT_TOKEN}`} className={classes.link}>
              <Button>
                <FontAwesomeIcon icon="pen" className={classes.icon} />
                Edit
              </Button>
            </Link>
            <Link to={`${url}${ROUTES.DELETE_TOKEN}`} className={classes.link}>
              <Button className={classes.middleButton}>
                <FontAwesomeIcon icon="trash" className={classes.icon} />
                Delete Link
              </Button>
            </Link>
            <Link to={`${url}${ROUTES.ADD_TOKEN}`} className={classes.link}>
              <Button>
                <FontAwesomeIcon icon="plus-circle" className={classes.icon} />
                Add Link
              </Button>
            </Link>
          </div>
        </div>
        <h5 className={classes.subTitle}>Linked Tokens</h5>
        <div className={classes.publicAddresses}>
          {publicAddresses &&
            publicAddresses.map(pubAddress =>
              isDesktop ? (
                <TokenBadge {...pubAddress} key={pubAddress.publicAddress} />
              ) : (
                <TokenBadgeMobile
                  {...pubAddress}
                  key={pubAddress.publicAddress}
                />
              ),
            )}
        </div>
      </div>
    </PseudoModalContainer>
  );
};

export default ListToken;
