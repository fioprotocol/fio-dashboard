import React, { Component } from 'react';
import { Modal, Collapse } from 'antd';

const Panel = Collapse.Panel;

class Info extends Component {
  render() {
    const {
      fullName,
      phone,
      companyName,
      position,
      birthDate,
      email,
    } = this.props.user;
    return (
      <Collapse accordion>
        <Panel header="User" key="1">
          <p>full name: {fullName}</p>
          <p>email: {email}</p>
          <p>phone: {phone}</p>
          <p>company name: {companyName}</p>
          <p>position: {position}</p>
          <p>birth date: {birthDate}</p>
        </Panel>
      </Collapse>
    );
  }
}

class UserInfo extends Component {
  render() {
    const { user, hideUser } = this.props;

    return (
      <Modal
        title="User Info"
        visible={!!user}
        onCancel={hideUser}
        onOk={hideUser}
        width="90%"
      >
        {user && <Info user={user} />}
      </Modal>
    );
  }
}

export default UserInfo;
