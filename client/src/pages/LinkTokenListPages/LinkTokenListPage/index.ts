import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose, getElementByFioName } from '../../../utils';

import LinkTokenListPage from './LinkTokenListPage';

const publicAddresses = [
  {
    chainCode: 'FIO',
    tokenCode: 'FIO',
    publicAddress: 'FIO6cp3eJMhtAuQvzetCAqcUAyLBabHj8M8hJD5nA8T1p7FoXaTd2',
  },
  {
    chainCode: 'ETH',
    tokenCode: 'ETH',
    publicAddress: 'ETHxab5801a7d398351b8be11c439e05c5b3259aec9b',
  },
  {
    chainCode: 'BTC',
    tokenCode: 'BTC',
    publicAddress: 'BTCxab5801a7d398351b8be11c439e05c5b3259aec9b',
  },
]; // todo: remove on get real public addresses

const reduxConnect = connect(
  createStructuredSelector({
    currentFioAddress: (state: any, ownProps: any) => {
      const {
        match: {
          params: { id },
        },
      } = ownProps;
      const {
        fio: { fioAddresses },
      } = state;

      const currentAddress = getElementByFioName({
        fioNameList: fioAddresses,
        name: id,
      });

      return {
        ...currentAddress,
        publicAddresses, // todo: remove on get real public addresses
      };
    },
  }),
  {},
);

export default withRouter(compose(reduxConnect)(LinkTokenListPage));
