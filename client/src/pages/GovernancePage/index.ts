import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import GovernancePagePage from './GovernancePage';

const reduxConnect = connect(createStructuredSelector({}), {});

export default compose(reduxConnect)(GovernancePagePage);
