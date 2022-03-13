import { connect } from 'react-redux';

import { loadProfile } from '../../../../redux/profile/actions';

import WidgetContainer from './WidgetContainer';

export default connect(null, {
  loadProfile,
})(WidgetContainer);
