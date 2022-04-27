import { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../utils';

import { getPrices } from '../redux/registrations/actions';

import { roe, roeSetDate } from '../redux/registrations/selectors';

type Props = {
  roe: number | null;
  roeSetDate: Date;
  getPrices: () => void;
};

const ROE_UPDATE_TIMEOUT = 1000 * 60 * 30; // 30 min

const Roe = (props: Props): null => {
  const { roe, roeSetDate, getPrices } = props;

  useEffect(() => {
    if (roe == null) {
      getPrices();
    }
  }, [roe, getPrices]);

  if (
    roe != null &&
    new Date().getTime() - roeSetDate.getTime() > ROE_UPDATE_TIMEOUT
  ) {
    getPrices();
  }

  return null;
};

// connector
const reduxConnect = connect(
  createStructuredSelector({
    roe,
    roeSetDate,
  }),
  {
    getPrices,
  },
);

export default compose(reduxConnect)(Roe);
