import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './CreateAccountForm.module.scss';
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default class Wizard extends React.Component {
  static propTypes = {
    onNext: PropTypes.func.isRequired,
    onPrev: PropTypes.func.isRequired,
    activePage: PropTypes.number.isRequired,
    actionDisabled: PropTypes.bool,
    loading: PropTypes.bool
  };
  static Page = ({ children }) => children;

  next = () =>
    this.props.onNext(Math.min(this.props.activePage + 1, this.props.children.length - 1))

  previous = () =>
    this.props.onPrev(Math.max(this.props.activePage - 1, 0))

  render() {
    const { activePage, actionDisabled, loading, children } = this.props;

    const page = React.Children.toArray(children)[activePage];
    const isLastPage = activePage === React.Children.count(children) - 1;
    const { props: { bottomText, hideNext, hideBack, onBack } = {} } = page || {};

    return (
      <>
        {page}
        {activePage > 0 && !hideBack && (
          <FontAwesomeIcon
            icon='arrow-left'
            className={classes.arrow}
            onClick={this.previous}
          />
        )}
        {!isLastPage && !hideNext && (
          <Button onClick={this.next} className='w-100'>
            NEXT {loading && <FontAwesomeIcon icon={faSpinner} spin />}
          </Button>
        )}
        {!isLastPage && onBack && !actionDisabled && (
          <Button className='w-100' onClick={this.previous}>
            START OVER
          </Button>
        )}
        {isLastPage && (
          <Button type='submit' disabled={loading}>
            CREATE ACCOUNT
          </Button>
        )}
        {bottomText}
      </>
    );
  }
}
