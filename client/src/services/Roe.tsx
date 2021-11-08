import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { RouterProps, withRouter } from 'react-router-dom';

import { compose } from '../utils';

import { getPrices } from '../redux/registrations/actions';

import { roe, roeSetDate } from '../redux/registrations/selectors';

type Props = {
  roe: number | null;
  roeSetDate: Date;
  getPrices: () => void;
};

const ROE_UPDATE_TIMEOUT = 1000 * 60 * 30; // 30 min

const Roe = (props: Props & RouterProps): React.FC => {
  const { roe, roeSetDate, getPrices } = props;

  useEffect(() => {
    if (roe == null) {
      getPrices();
    }
  }, [roe]);

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

export default withRouter(compose(reduxConnect)(Roe));
