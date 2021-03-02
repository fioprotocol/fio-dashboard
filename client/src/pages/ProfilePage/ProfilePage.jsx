import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Table } from 'antd';
import classnames from './ProfilePage.module.scss';

const columns = [
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Username',
    dataIndex: 'username',
  },
];

export default class ProfilePage extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
  };

  render() {
    const { user } = this.props;
    return (
      <div className={classnames.container}>
        <Card title="My profile" className={classnames.card}>
          <Table
            rowKey="email"
            columns={columns}
            className={classnames.table}
            dataSource={[user]}
            pagination={false}
          />
        </Card>
      </div>
    );
  }
}
