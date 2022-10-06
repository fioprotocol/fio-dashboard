import React from 'react';

import Badge from 'react-bootstrap/Badge';

import classNames from 'classnames';

import Modal from '../../../../components/Modal/Modal';
import { parseActionStatus } from '../WrapStatus';

import { BADGE_TYPES } from '../../../Badge/Badge';
import { WrapStatusWrapItem } from '../../../../types';
import { formatDateToLocale } from '../../../../helpers/stringFormatters';
import apis from '../../../../api';

import classes from './../WrapStatus.module.scss';
import InfoBadge from '../../../InfoBadge/InfoBadge';

type Props = {
  itemData?: WrapStatusWrapItem;
  onClose: () => void;
  isWrap: boolean;
  isTokens: boolean;
};

// todo: refactor
const DetailsModal: React.FC<Props> = props => {
  const { itemData, onClose, isWrap, isTokens } = props;

  const { badgeType, badgeText, isPending } = parseActionStatus(itemData);

  return (
    <Modal
      show={!!itemData}
      closeButton={true}
      isSimple={true}
      isWide={true}
      hasDefaultCloseColor={true}
      onClose={onClose}
    >
      <div className="d-flex flex-column w-100">
        <h3 className="d-flex mt-2 mb-3 justify-content-between">
          <div>
            {isWrap ? 'Wrap' : 'Unwrap'} FIO {isTokens ? 'Tokens' : 'Domain'}
          </div>
          {itemData ? <Badge variant={badgeType}>{badgeText}</Badge> : null}
        </h3>
        {itemData ? (
          <div>
            <div className="d-flex justify-content-between my-2">
              <div className="mr-3">
                <b>Trx_id:</b>
              </div>
              <div className={classNames(classes.trxId, 'mr-3')}>
                <a
                  href={
                    (itemData.transactionHash
                      ? isTokens
                        ? process.env.REACT_APP_ETH_HISTORY_URL
                        : process.env.REACT_APP_POLYGON_HISTORY_URL
                      : process.env.REACT_APP_FIO_BLOCKS_TX_URL) +
                    (itemData.transactionHash || itemData.transactionId)
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  {itemData.transactionHash || itemData.transactionId}
                </a>
              </div>
            </div>
            <div className="d-flex justify-content-between my-2">
              <div className="mr-3">
                <b>Date:</b>
              </div>
              <div>
                {itemData.data.action_trace?.block_time
                  ? formatDateToLocale(
                      itemData.data.action_trace.block_time + 'Z',
                    )
                  : null}
                {itemData.confirmData?.length &&
                itemData.confirmData[0].action_trace?.block_time
                  ? formatDateToLocale(
                      itemData.confirmData[0].action_trace.block_time,
                    )
                  : null}
              </div>
            </div>
            <div className="d-flex justify-content-between my-2">
              <div className="mr-3">
                <b>Chain:</b>
              </div>
              <div>{isWrap ? 'FIO' : isTokens ? 'ETH' : 'POLYGON'}</div>
            </div>
            <div className="d-flex justify-content-between my-2">
              <div className="mr-3">
                <b>Block Number:</b>
              </div>
              <div>{itemData.blockNumber}</div>
            </div>
            {itemData.data.action_trace?.act?.name ? (
              <div className="d-flex justify-content-between my-2">
                <div className="mr-3">
                  <b>Action type:</b>
                </div>
                <div>{itemData.data.action_trace.act.name}</div>
              </div>
            ) : null}
            {itemData.amount ? (
              <div className="d-flex justify-content-between my-2">
                <div className="mr-3">
                  <b>Amount:</b>
                </div>
                <div>
                  {apis.fio.sufToAmount(itemData.amount || 0).toFixed(2) +
                    ' FIO'}
                </div>
              </div>
            ) : null}
            {itemData.domain ? (
              <div className="d-flex justify-content-between my-2">
                <div className="mr-3">
                  <b>Domain:</b>
                </div>
                <div>{itemData.domain}</div>
              </div>
            ) : null}
            {itemData.data.action_trace?.act?.data?.actor ? (
              <div className="d-flex justify-content-between my-2">
                <div className="mr-3">
                  <b>From Account:</b>
                </div>
                <div>{itemData.data.action_trace.act.data.actor}</div>
              </div>
            ) : null}
            <div className="d-flex justify-content-between my-2">
              <div className="mr-3">
                <b>{isWrap ? 'To' : 'From'} Address:</b>
              </div>
              <div>{itemData.address}</div>
            </div>

            {itemData.data.action_trace ? (
              <div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>TPID:</b>
                  </div>
                  <div>
                    {JSON.stringify(itemData.data.action_trace.act.data.tpid)}
                  </div>
                </div>

                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Escrow Account:</b>
                  </div>
                  <div>{itemData.data.action_trace.receiver}</div>
                </div>
              </div>
            ) : null}

            {!isWrap && itemData.oravotes?.length ? (
              <div className="d-flex justify-content-between my-2">
                <div className="mr-3">
                  <b>To Handle:</b>
                </div>
                <div>{itemData.oravotes[0].fio_address}</div>
              </div>
            ) : null}

            <div className="mt-4">
              <div>
                <b>
                  <h4>Confirmation</h4>
                </b>
              </div>
            </div>

            {!isWrap && itemData.oravotes?.length ? (
              <div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Chain:</b>
                  </div>
                  <div>FIO</div>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Voters:</b>
                  </div>
                  <div>{JSON.stringify(itemData.oravotes[0].voters)}</div>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Is complete:</b>
                  </div>
                  <div>{JSON.stringify(!!itemData.oravotes[0].isComplete)}</div>
                </div>
              </div>
            ) : null}

            {isWrap && itemData.confirmData ? (
              <div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Trx_id:</b>
                  </div>
                  <div className={classes.trxId}>
                    <a
                      href={
                        (isTokens
                          ? process.env.REACT_APP_ETH_HISTORY_URL
                          : process.env.REACT_APP_POLYGON_HISTORY_URL) +
                        itemData.confirmData.transactionHash
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      {itemData.confirmData.transactionHash}
                    </a>
                  </div>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Chain:</b>
                  </div>
                  <div>
                    {itemData.data.action_trace.act.data.chain_code === 'MATIC'
                      ? 'Polygon'
                      : itemData.data.action_trace.act.data.chain_code}
                  </div>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Block Number:</b>
                  </div>
                  <div>{itemData.confirmData.blockNumber}</div>
                </div>
              </div>
            ) : null}

            {!isWrap && itemData.confirmData?.length ? (
              <div>
                <div className="my-2">
                  <div className="mr-3">
                    <b>Transactions ids:</b>
                  </div>
                  {itemData.confirmData.map((item: any) => (
                    <div
                      key={item.action_trace.trx_id}
                      className={classes.trxId}
                    >
                      <a
                        href={
                          process.env.REACT_APP_FIO_BLOCKS_TX_URL +
                          item.action_trace.trx_id
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.action_trace.trx_id}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <InfoBadge
              className={classes.infoBadge}
              type={isPending ? BADGE_TYPES.REGULAR : BADGE_TYPES.ERROR}
              show={!itemData.confirmData}
              title="Confirmation!"
              message={isPending ? 'Waiting...' : 'Something went wrong.'}
            />
          </div>
        ) : null}
      </div>
    </Modal>
  );
};

export default DetailsModal;
