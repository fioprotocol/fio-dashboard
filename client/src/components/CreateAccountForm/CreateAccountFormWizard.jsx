import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './CreateAccountForm.module.scss';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default class Wizard extends React.Component {
  state = {
    pageIsActive: true,
  };
  static propTypes = {
    onNext: PropTypes.func,
    onPrev: PropTypes.func,
    activePage: PropTypes.number.isRequired,
    actionDisabled: PropTypes.bool,
    loading: PropTypes.bool,
  };
  static Page = ({ children }) => children;

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.activePage !== this.props.activePage) {
      // appear animation
      this.setState({ pageIsActive: false }, () =>
        setTimeout(() => this.setState({ pageIsActive: true }), 10),
      );
    }
  }

  next = () =>
    this.props.onNext(
      Math.min(this.props.activePage + 1, this.props.children.length - 1),
    );

  previous = () => this.props.onPrev(Math.max(this.props.activePage - 1, 0));

  render() {
    const { activePage, actionDisabled, loading, children } = this.props;
    const { pageIsActive } = this.state;

    const page = React.Children.toArray(children)[activePage];
    const isLastPage = activePage === React.Children.count(children) - 1;
    const { props: { bottomText, hideNext, hideBack } = {} } = page || {};

    return (
      <>
        <div
          className={classnames(
            classes.page,
            pageIsActive ? classes.active : null,
          )}
        >
          {page}
        </div>
        {activePage > 0 && !hideBack && (
          <FontAwesomeIcon
            icon="arrow-left"
            className={classes.arrow}
            onClick={this.previous}
          />
        )}
        {!isLastPage && !hideNext && (
          <Button
            type="submit"
            className="w-100"
            disabled={loading || actionDisabled}
          >
            NEXT {loading && <FontAwesomeIcon icon={faSpinner} spin />}
          </Button>
        )}
        {bottomText}
      </>
    );
  }
}
