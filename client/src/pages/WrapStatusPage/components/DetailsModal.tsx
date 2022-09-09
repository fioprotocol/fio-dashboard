import React from 'react';

import Badge from 'react-bootstrap/Badge';

import Modal from '../../../components/Modal/Modal';

import { WrapStatusWrapItem } from '../../../types';
import { formatDateToLocale } from '../../../helpers/stringFormatters';
import apis from '../../../api';

type Props = {
  itemData?: WrapStatusWrapItem;
  onClose: () => void;
  isWrap: boolean;
  isTokens: boolean;
  isComplete: boolean;
};

const DetailsModal: React.FC<Props> = props => {
  const { itemData, onClose, isComplete, isWrap } = props;

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
          <div>Action Details</div>
          {itemData ? (
            <Badge variant={isComplete ? 'primary' : 'secondary'}>
              {isComplete ? 'Complete' : 'Pending'}
            </Badge>
          ) : null}
        </h3>
        {itemData ? (
          <div>
            <div className="d-flex justify-content-between my-2">
              <div className="mr-3">
                <b>Trx_id:</b>
              </div>
              <div>{itemData.transactionHash || itemData.transactionId}</div>
            </div>
            <div className="d-flex justify-content-between my-2">
              <div className="mr-3">
                <b>Chain:</b>
              </div>
              <div>FIO</div>
            </div>
            <div className="d-flex justify-content-between my-2">
              <div className="mr-3">
                <b>Block Number:</b>
              </div>
              <div>{itemData.blockNumber}</div>
            </div>
            <div className="d-flex justify-content-between my-2">
              <div className="mr-3">
                <b>Date:</b>
              </div>
              <div>
                {itemData.data.action_trace?.block_time
                  ? formatDateToLocale(itemData.data.action_trace.block_time)
                  : null}
              </div>
            </div>
            <div className="d-flex justify-content-between my-2">
              <div className="mr-3">
                <b>{isWrap ? 'To' : 'From'} Address</b>
              </div>
              <div>{itemData.address}</div>
            </div>
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
            {itemData.data.action_trace ? (
              <div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Action type:</b>
                  </div>
                  <div>{itemData.data.action_trace.act.name}</div>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Receiver:</b>
                  </div>
                  <div>{itemData.data.action_trace.receiver}</div>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Actor:</b>
                  </div>
                  <div>{itemData.data.action_trace.act.data.actor}</div>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>tpid:</b>
                  </div>
                  <div>
                    {JSON.stringify(itemData.data.action_trace.act.data.tpid)}
                  </div>
                </div>
              </div>
            ) : null}

            {isWrap && itemData.confirmData ? (
              <div className="mt-4">
                <div>
                  <b>
                    <h4>Confirm data</h4>
                  </b>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Trx_id:</b>
                  </div>
                  <div>{itemData.confirmData.transactionHash}</div>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Chain:</b>
                  </div>
                  <div>{itemData.data.action_trace.act.data.chain_code}</div>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Block Number:</b>
                  </div>
                  <div>{itemData.confirmData.blockNumber}</div>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Event name:</b>
                  </div>
                  <div>{itemData.confirmData.event}</div>
                </div>
              </div>
            ) : null}

            {!isWrap && itemData.confirmData ? (
              <div className="mt-4">
                <div>
                  <b>
                    <h4>Confirm data</h4>
                  </b>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Chain:</b>
                  </div>
                  <div>FIO</div>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Oracles votes id:</b>
                  </div>
                  <div>{itemData.confirmData.id}</div>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Date:</b>
                  </div>
                  <div>
                    {itemData.confirmData?.timestamp
                      ? formatDateToLocale(itemData.confirmData.timestamp)
                      : null}
                  </div>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Voters:</b>
                  </div>
                  <div>{JSON.stringify(itemData.confirmData.voters)}</div>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>Is complete:</b>
                  </div>
                  <div>{JSON.stringify(!!itemData.confirmData.isComplete)}</div>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <div className="mr-3">
                    <b>FIO Address:</b>
                  </div>
                  <div>{itemData.confirmData.fio_address}</div>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </Modal>
  );
};

export default DetailsModal;
