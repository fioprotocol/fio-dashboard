import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Navigation } from './Navigation';

import {
  refProfileInfo,
  loading as refProfileLoading,
} from '../../redux/refProfile/selectors';

const selector = createStructuredSelector({
  refProfileInfo,
  refProfileLoading,
});

// @ts-ignore // todo: change to useLocation in component, update react-router-redux/react-router-dom/react-redux, replace react-router-redux by connected-react-router
export default withRouter(connect(selector)(Navigation));
