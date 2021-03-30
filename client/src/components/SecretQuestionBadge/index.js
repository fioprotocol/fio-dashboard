import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { edgeContextSet } from '../../redux/edge/selectors';

import { showRecoveryModal as showModal } from '../../redux/modal/actions';
import { user } from '../../redux/profile/selectors';
import SecretQuestionBadge from './SecretQuestionBadge';

const selector = createStructuredSelector({
  user,
  edgeContextSet,
});

export default connect(selector, { showModal })(SecretQuestionBadge);
