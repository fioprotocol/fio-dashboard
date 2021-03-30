import React, { Component } from 'react';
import classnames from 'classnames';

import FormHeader from '../FormHeader/FormHeader';

import classes from './CreateAccountForm.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Row } from "react-bootstrap";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default class Confirmation extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
    }
  }

  toggleOpen = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    const { data, loading } = this.props;
    const { isOpen } = this.state;

    return (
      <>
        <FormHeader
          header='Almost Done!'
          title='Write It Down!'
          subtitle='Please write down your account information now'
          isSubNarrow
        />
        <div className={classes.infoBadge}>
          <FontAwesomeIcon icon='info-circle' className={classes.icon} />
          <div className={classes.textWrapper}>
            <p className='mb-0 mt-3'>
              If you lose your account information, you’ll lose access to
              your account permanently.
            </p>
            <p className='mb-0 mt-3'>Write down and store it securely.</p>
          </div>
        </div>
        <div className={classes.accountInfo}>
          <div className={classes.header} onClick={this.toggleOpen}>
            <div className={classes.text}>Show Account Information</div>
            <FontAwesomeIcon
              icon={isOpen ? 'chevron-up' : 'chevron-down'}
              className={classes.icon}
            />
          </div>
          <div
            className={classnames(
              classes.badge,
              isOpen && classes.open,
              classes.roll
            )}
          >
            <Row className='mx-3 pt-3'>
              <Col xs={1}>
                <FontAwesomeIcon
                  icon='user-circle'
                  className={classes.icon}
                />
              </Col>
              <Col xs={3}>Email</Col>
              <Col xs={6}>{data.email}</Col>
            </Row>
            <Row className='mx-3 py-2'>
              <Col xs={1}>
                <FontAwesomeIcon icon='ban' className={classes.icon} />
              </Col>
              <Col xs={3}>Password</Col>
              <Col xs={6}>{data.password}</Col>
            </Row>
            <Row className='mx-3 pb-2'>
              <Col xs={1}>
                <FontAwesomeIcon icon='keyboard' className={classes.icon} />
              </Col>
              <Col xs={3}>PIN</Col>
              <Col xs={6}>{data.pin}</Col>
            </Row>
          </div>
        </div>

        <Button type='submit' disabled={loading}>
          CREATE ACCOUNT {loading && <FontAwesomeIcon icon={faSpinner} spin/>}
        </Button>
      </>
    );
  }
}
