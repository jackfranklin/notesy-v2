import React from 'react';

import SidebarDocument from './sidebar-document';

export default class Sidebar extends React.Component {
  renderDocuments() {
    return this.props.documents.map((doc) => {
      return (
        <li key={doc._id} className="sidebar-document">
          <SidebarDocument doc={doc} />
        </li>
      );
    });
  }

  render() {
    return (
      <ul className="sidebar-list">
        { this.renderDocuments() }
      </ul>
    );
  }
}
