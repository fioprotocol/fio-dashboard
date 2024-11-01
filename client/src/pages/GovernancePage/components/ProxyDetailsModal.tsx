import { FC } from 'react';

import Modal from '../../../components/Modal/Modal';

import classes from '../styles/ProxyDetailsModal.module.scss';
import { WalletPower } from './WalletPower';

export type ProxyDetails = {
  owner: string;
  handle: string;
  proxiedVoteWeight: number;
  lastVoteWeight: number;
  producers: string[];
};

export type ProxyDetailsModalProps = {
  data: ProxyDetails;
  show: boolean;
  onClose: () => void;
};

export const ProxyDetailsModal: FC<ProxyDetailsModalProps> = props => {
  const { data, show, onClose } = props;

  return (
    <Modal
      title="Proxy Details"
      headerClass={classes.header}
      show={show}
      onClose={onClose}
      closeButton={true}
      isSimple={true}
      hasDefaultCloseColor={true}
      isMiddleWidth={true}
    >
      <div className={classes.container}>
        <div className={classes.info}>
          <span>{data.owner}</span>
          <span>FIO Handle: {data.handle}</span>
        </div>
        <div className={classes.details}>
          <h5 className={classes.detailsTitle}>Details</h5>
          <ul>
            <li>
              <WalletPower
                className={classes.detailsPower}
                power={data.proxiedVoteWeight}
                label="Proxied Vote Weight"
                withLabel={true}
              />
            </li>
            <li>
              <WalletPower
                className={classes.detailsPower}
                power={data.lastVoteWeight}
                label="Last Vote Weight"
                withLabel={true}
              />
            </li>
          </ul>
        </div>
        <div className={classes.producers}>
          <h5 className={classes.producersTitle}>Producer Voting</h5>
          <p className={classes.producersDescription}>
            This proxy is voting for the following {data.producers.length}&nbsp;
            producers
          </p>
          <div className={classes.producersGrid}>
            {data.producers.map(it => (
              <span key={it} className={classes.producersItem}>
                {it}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
