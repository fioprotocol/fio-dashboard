import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './CreateAccountForm.module.scss';

export default class Wizard extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };
  static Page = ({ children }) => children;

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      values: props.initialValues || {},
    };
  }
  next = (values) =>
    this.setState((state) => ({
      page: Math.min(state.page + 1, this.props.children.length - 1),
      values,
    }));

  previous = () =>
    this.setState((state) => ({
      page: Math.max(state.page - 1, 0),
    }));

  /**
   * NOTE: Both validate and handleSubmit switching are implemented
   * here because 🏁 Redux Final Form does not accept changes to those
   * functions once the form has been defined.
   */

  validate = (values) => {
    const activePage = React.Children.toArray(this.props.children)[
      this.state.page
    ];
    return activePage && activePage.props.validate
      ? activePage.props.validate(values)
      : {};
  };

  handleSubmit = (values) => {
    const { children, onSubmit } = this.props;
    const { page } = this.state;
    const isLastPage = page === React.Children.count(children) - 1;
    if (isLastPage) {
      return onSubmit(values);
    } else {
      this.next(values);
    }
  };

  renderForm = () => {
    const { children } = this.props;
    const { page, values, completed } = this.state;
    const activePage = React.Children.toArray(children)[page];
    const isLastPage = page === React.Children.count(children) - 1;

    const { props: { bottomText, hideNext, hideBack } = {} } =
      activePage || {};

    return activePage ? (
      <Form
        initialValues={values}
        validate={this.validate}
        onSubmit={this.handleSubmit}
      >
        {({ handleSubmit, submitting, values }) => (
          <form
            onSubmit={handleSubmit}
            className={classes.form}
          >
            {activePage}
            {page > 0 && !hideBack && (
              <FontAwesomeIcon
                icon='arrow-left'
                className={classes.arrow}
                onClick={this.previous}
              />
            )}
            {!isLastPage && !hideNext && (
              <Button type='submit' className='w-100'>
                NEXT
              </Button>
            )}
            {isLastPage && (
              <Button type='submit' disabled={submitting}>
                CREATE ACCOUNT
              </Button>
            )}
            {bottomText}
          </form>
        )}
      </Form>
    ) : null;
  }

  render() {
    return this.renderForm();
  }
}
