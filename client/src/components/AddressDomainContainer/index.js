import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import AddressDomainContainer from './AddressDomainContainer';

import { allowCustomDomains } from '../../redux/registrations/selectors';

import { compose } from '../../utils';

export default compose(
  connect(createStructuredSelector({ allowCustomDomains })),
)(AddressDomainContainer);
