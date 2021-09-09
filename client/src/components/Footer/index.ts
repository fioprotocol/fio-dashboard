import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { homePageLink } from '../../redux/refProfile/selectors';

import Footer from './Footer';

const selector = createStructuredSelector({
  homePageLink,
});

export default connect(selector)(Footer);
