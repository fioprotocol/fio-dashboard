import { connect } from 'react-redux';

import { showRecoveryModal as showModal } from '../../redux/modal/actions';
import SecretQuestionBadge from './SecretQuestionBadge';

export { SecretQuestionBadge };

export default connect(null, { showModal })(SecretQuestionBadge);
