import React, { Component } from 'react';
import { Table, Button, Tag } from 'antd';
import styles from './AdminUsersPage.module.scss';
import UserInfo from '../../components/UserInfo';

const { Column } = Table;

class AdminUsersPage extends Component {
  componentWillMount() {
    this.props.listUsers();
  }

  renderRole = role => (
    <span>
      <Tag color={role === 'USER' ? 'geekblue' : 'volcano'}>{role}</Tag>
    </span>
  );

  renderStatus = status => (
    <span>
      <Tag color={status === 'ACTIVE' ? 'green' : 'gold'}>{status}</Tag>
    </span>
  );

  renderActions = id => (
    <span>
      <Button size="small" onClick={() => this.props.showUser(id)}>
        INFO
      </Button>
    </span>
  );

  render() {
    const { loading, list } = this.props;
    return (
      <div className={styles.table}>
        <UserInfo />
        <Table
          rowKey="id"
          size="small"
          loading={loading}
          dataSource={list}
          pagination={false}
          showHeader={false}
        >
          <Column title="email" dataIndex="email" />
          <Column title="role" dataIndex="role" render={this.renderRole} />
          <Column
            title="status"
            dataIndex="status"
            render={this.renderStatus}
          />
          <Column title="actions" dataIndex="id" render={this.renderActions} />
        </Table>
      </div>
    );
  }
}

export default AdminUsersPage;
